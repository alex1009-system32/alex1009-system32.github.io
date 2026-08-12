import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos } from "../api/githubApi";
import type { Repo } from "../types";

export const useGitHubRepos = (username: string) => {
  return useQuery({
    queryKey: ["githubRepos", username],
    queryFn: () => fetchGitHubRepos(username),

    staleTime: 1000 * 60 * 5,
    enabled: !!username,

    select: (data): Repo[] =>
      data.map((repo) => ({
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
