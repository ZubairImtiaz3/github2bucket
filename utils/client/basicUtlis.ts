import axios from "axios";

export async function fetchRepositories(token: string) {
  //TODO: Add types to repo:any so we can use it in the map
  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Extracting only the required data
    const Repos = response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      lastUpdated: repo.updated_at,
      url: repo.html_url,
    }));

    return Repos;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
}

export async function fetchWorkspaces(token: string) {
  try {
    const response = await axios.get(
      "https://api.bitbucket.org/2.0/workspaces",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Extracting only the required data
    const Workspaces = response.data.values.map((workspace: any) => ({
      id: workspace.uuid,
      name: workspace.name,
      repositories: workspace.links.repositories.href,
      projects: workspace.links.projects.href,
    }));

    return Workspaces;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
}

export async function fetchWorkspaceProjects(token: string, workspaceName: string) {
  //TODO: make the name capitalized in body as per original
  try {
    const response = await axios.get(
      `https://api.bitbucket.org/2.0/workspaces/${workspaceName}/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Extracting only the required data
    const WorkspaceProjects = response.data.values.map((projects: any) => ({
      name: projects.name,
    }));

    return WorkspaceProjects;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
}

export async function createBitbucketRepository(token: string, workspaceName: string, repositoryName: string) {
  try {
    const response = await axios.post(
      `https://api.bitbucket.org/2.0/repositories/${workspaceName}/${repositoryName}`,
      {
        "name": repositoryName,
        // "description": "testing workflow 1",
        "is_private": false,
        "forks_count": 0,
        "has_issues": false,
        "has_wiki": true,
        "fork_policy": "allow_forks",
        "mainbranch": {
          "type": "string"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log(`Repository ${repositoryName} created`);
    } else {
      throw new Error("Failed to create repository");
    }
  } catch (error) {
    console.error("Error creating repository:", error);
    throw error;
  }
}

export async function hub2bucket(data: any) {
  //TODO: replace the prod url
  try {
    const response = await axios.post(
      "http://localhost:3000/hub2bucket",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return true;
    } else {
      throw new Error("Failed to migrate repository");
    }
  } catch (error) {
    console.error("Error migrating repository:", error);
    throw error;
  }
}