import { NextResponse } from "next/server";
import simpleGit, { SimpleGit } from "simple-git";
const fs = require("fs").promises;

interface RequestBody {
    userName: string;
    providerToken: string;
    workspaceName: string;
    repositoryName: string;
    cloneRepositoryUrl: string;
}

export async function POST(req: Request) {
    const body: RequestBody = await req.json();

    const {
        userName,
        providerToken,
        workspaceName,
        repositoryName,
        cloneRepositoryUrl,
    } = body;

    const git: SimpleGit = simpleGit();

    try {
        // Clone the repository
        await git.clone(cloneRepositoryUrl);

        // Extract repository name from cloneRepositoryUrl
        const ClonedRepositoryName = cloneRepositoryUrl.split('/').pop()!;

        // Enter the cloned repository directory
        git.cwd(ClonedRepositoryName);

        // Remove the origin
        await git.remote(["remove", "origin"]);

        // Add a new origin
        const newOriginUrl = `https://${userName}:${providerToken}@bitbucket.org/${workspaceName}/${repositoryName}.git`;
        await git.addRemote("origin", newOriginUrl);

        // Check the default branch
        const { current: defaultBranch } = await git.branchLocal();
        const main = defaultBranch || "main";

        // Push to the default branch
        await git.push(["-u", "origin", main]);

        // Delete the cloned repository from local machine
        await fs.rm(ClonedRepositoryName, { recursive: true });

        const data = {
            message: `Hello ${userName}! Cloned ${ClonedRepositoryName} and pushed ${main} branch successfully on bitbucket.`,
            providerToken: providerToken,
            workspaceName: workspaceName,
            repositoryName: repositoryName,
            cloneRepositoryUrl: cloneRepositoryUrl,
        };

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error });
    }
}
