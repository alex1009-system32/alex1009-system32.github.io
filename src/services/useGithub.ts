import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos, fetchGitHubUser } from "./githubService";

export const useGitHubRepo = (username: string) => {
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

export const useGitHubUser = (username: string) => {
  return useQuery({
    queryKey: ["githubUser", username],
    queryFn: () => fetchGitHubUser(username),

    enabled: !!username,

    select: (data) => ({
      name: data.name,
      bio: data.bio || "Not given",
      img_url: data.avatar_url,
      loc: data.location || "Not given",
    }),
  });
};
