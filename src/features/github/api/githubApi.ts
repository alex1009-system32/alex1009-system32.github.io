import { GITHUB_API_BASE_URL } from "../../../lib/config";
import type { GitHubRepoResponse, GitHubUserResponse } from "../types";

/** Fehlerantworten der GitHub-API tragen die Erklärung in `message`. */
interface GitHubErrorResponse {
  message?: string;
}

/**
 * Einziger Ort, an dem diese Anwendung das Netz anspricht. Die Fehlerbehandlung
 * liegt damit an einer Stelle statt in jeder Abfrage.
 */
async function requestGitHub<T>(pfad: string, fehlertext: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${pfad}`);

  if (!response.ok) {
    const errorData = (await response.json()) as GitHubErrorResponse;
    throw new Error(errorData.message || fehlertext);
  }

  return response.json() as Promise<T>;
}

export const fetchGitHubRepos = (username: string) =>
  requestGitHub<GitHubRepoResponse[]>(
    `/users/${username}/repos`,
    "Failed to fetch GitHub repositories",
  );

export const fetchGitHubUser = (username: string) =>
  requestGitHub<GitHubUserResponse>(
    `/users/${username}`,
    "Failed to fetch Github user",
  );
