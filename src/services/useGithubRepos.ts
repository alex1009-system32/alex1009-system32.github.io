import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos } from "./githubService";

export const useGithubRepo = (username: string) => {
  return useQuery({
    queryKey: ["githubRepos", username],
    queryFn: () => fetchGitHubRepos(username),

    staleTime: 1000 * 60 * 5,
    enabled: !!username,

    select: (data) =>
      data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        project_url: repo.svn_url,
        last_updated: repo.updated_at,
        archived: repo.archived,
        language: repo.language || "Mixed",
      })),
  });
};
