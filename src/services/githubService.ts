/** Rohform der GitHub-Antworten — nur die Felder, die diese Anwendung ausliest. */
export interface GitHubUserResponse {
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
}

export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  svn_url: string;
  updated_at: string;
  archived: boolean;
  language: string | null;
}

/** Fehlerantworten der GitHub-API tragen die Erklärung in `message`. */
interface GitHubErrorResponse {
  message?: string;
}

export const fetchGitHubRepos = async (
  username: string,
): Promise<GitHubRepoResponse[]> => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
  );

  if (!response.ok) {
    const errorData = (await response.json()) as GitHubErrorResponse;
    throw new Error(errorData.message || "Failed to fetch GitHub repositories");
  }

  return response.json() as Promise<GitHubRepoResponse[]>;
};

export const fetchGitHubUser = async (
  username: string,
): Promise<GitHubUserResponse> => {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    const errorData = (await response.json()) as GitHubErrorResponse;
    throw new Error(errorData.message || "Failed to fetch Github user");
  }

  return response.json() as Promise<GitHubUserResponse>;
};
