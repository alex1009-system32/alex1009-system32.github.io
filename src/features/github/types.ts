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

/** Aufbereitete Form, wie die Abschnitte der Seite sie erwarten. */
export interface User {
  name: string | null;
  bio: string;
  img_url: string;
  loc: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  project_url: string;
  last_updated: string;
  archived: boolean;
  language: string;
}
