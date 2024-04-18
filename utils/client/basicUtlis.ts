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
