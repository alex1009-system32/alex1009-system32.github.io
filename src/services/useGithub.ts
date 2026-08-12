import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos, fetchGitHubUser } from "./githubService";

/** Aufbereitete Form, wie die Komponenten sie erwarten. */
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  project_url: string;
  last_updated: string;
  archived: boolean;
  language: string;
}

export interface User {
  name: string | null;
  bio: string;
  img_url: string;
  loc: string;
}

export const useGitHubRepo = (username: string) => {
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

export const useGitHubUser = (username: string) => {
  return useQuery({
    queryKey: ["githubUser", username],
    queryFn: () => fetchGitHubUser(username),

    enabled: !!username,

    select: (data): User => ({
      name: data.name,
      bio: data.bio || "Not given",
      img_url: data.avatar_url,
      loc: data.location || "Not given",
    }),
  });
};
