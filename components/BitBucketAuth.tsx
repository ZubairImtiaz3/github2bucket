"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  fetchWorkspaces,
  createBitbucketRepository,
  hub2bucket,
} from "@/utils/client/basicUtlis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Workspace {
  uuid: number;
  name: string;
  repositories: string;
  projects: string;
}

interface Repository {
  id: number;
  url: string;
}

export default function BitBucketAuth({
  providerToken,
}: {
  providerToken: string;
}) {
  // console.log("token", providerToken);
  const supabase = createClient();
  const [showButton, setShowButton] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [creatingRepo, setCreatingRepo] = useState<boolean>(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    if (providerToken.startsWith("gho")) {
      setShowButton(true);
    } else {
      setShowButton(false);
      workSpaces(providerToken);
    }
  }, [providerToken]);

  useEffect(() => {
    const storedRepos = sessionStorage.getItem("selectedRepos");
    if (storedRepos) {
      setRepositories(JSON.parse(storedRepos));
    }
  }, []);

  async function workSpaces(providerToken: string) {
    try {
      const response = await fetchWorkspaces(providerToken);
      // console.log(response);
      setWorkspaces(response);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  }

  async function signInWithBitBucket() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "bitbucket",

      //TODO: fix redirectTo for prod
      options: {
        redirectTo: "http://localhost:3000/auth/bitbucket",
      },
    });
  }

  async function handleWorkspaceClick(workspaceName: string) {
    setSelectedWorkspace(workspaceName);
    setCreatingRepo(true);
    await createRepositories(workspaceName);
  }

  async function createRepositories(workspaceName: string) {
    for (const repo of repositories) {
      let repositoryName = repo.url.split("/").pop()!.toLowerCase(); // Convert to lowercase
      repositoryName = repositoryName.replace(/ /g, "-"); // Replace spaces with dashes
      await createBitbucketRepository(
        providerToken,
        workspaceName,
        repositoryName
      );
      await hub2bucket({
        userName: "ZubairImtiaz3",
        providerToken,
        workspaceName,
        repositoryName,
        cloneRepositoryUrl: repo.url,
      });
    }
    setCreatingRepo(false);
  }

  return (
    <>
      {showButton && (
        <Button onClick={signInWithBitBucket}>Connect your Bitbucket</Button>
      )}
      {!showButton && (
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Select a Workspace</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workspaces.map((workspace) => (
                <Button
                  key={workspace.uuid}
                  size="sm"
                  variant="secondary"
                  onClick={() => handleWorkspaceClick(workspace.name)}
                >
                  {workspace.name}
                </Button>
              ))}
            </CardContent>
          </Card>
          {creatingRepo && (
            <Card>
              <CardHeader>
                <CardTitle>Create Repositories</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Repositories are being created in {selectedWorkspace}...</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
