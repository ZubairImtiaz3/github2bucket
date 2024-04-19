// Post Api to create a repo in bitbucket
// get repoToMigrate from session and post api to migrate the repo

import BitBucketAuth from "@/components/BitBucketAuth";
import {
  fetchWorkspaceProjects,
  fetchWorkspaces,
} from "@/utils/client/basicUtlis";
import { createClient } from "@/utils/supabase/server";

const page = async () => {
  // TODO: Show Bitbucket Auth while session is not of github, show all workspaces and allow user to pick one to migrate to.

  const supabase = createClient();
  await supabase.auth.getUser();
  const { data } = await supabase.auth.getSession();

  // Extracting provider_token from the session
  const providerToken = data.session?.provider_token || "";

  console.log("provider token", providerToken);
  console.log(data);

  const Workspaces = await fetchWorkspaces(providerToken);
  console.log("workspaces", Workspaces);

  const selectedWorkspace = Workspaces[0].name;

  const workspacesProjects = await fetchWorkspaceProjects(
    providerToken,
    selectedWorkspace
  );

  console.log("workspacesProjects", workspacesProjects);

  return (
    <>
      <div className="text-center p-12">
        <BitBucketAuth />
      </div>
    </>
  );
};

export default page;
