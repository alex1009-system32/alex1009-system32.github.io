/**
 * Öffentliche Schnittstelle des Features. Alles, was von außen gebraucht wird,
 * geht über diese Datei — nie direkt auf eine interne Datei.
 */
export { useGitHubUser } from "./hooks/useGitHubUser";
export { useGitHubRepos } from "./hooks/useGitHubRepos";
export type { Repo, User } from "./types";
