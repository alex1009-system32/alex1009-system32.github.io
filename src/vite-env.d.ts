/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * GitHub-Nutzername, dessen Profil und Repositories die Seite anzeigt.
   * Optional — ohne Angabe greift der Fallback in `src/lib/config.ts`.
   */
  readonly VITE_GITHUB_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
