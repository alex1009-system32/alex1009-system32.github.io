import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/githubApi";
import type { User } from "../types";

export const useGitHubUser = (username: string) => {
  return useQuery({
    queryKey: ["githubUser", username],
    queryFn: () => fetchGitHubUser(username),

    staleTime: 1000 * 60 * 5,
    enabled: !!username,

    select: (data): User => ({
      name: data.name,
      bio: data.bio || "Not given",
      img_url: data.avatar_url,
      loc: data.location || "Not given",
    }),
  });
};
