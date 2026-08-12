/**
 * Öffentliche Konfiguration der Seite.
 *
 * Achtung: Alles mit `VITE_`-Präfix wird beim Build ins Bundle inlined und ist
 * für jeden Besucher lesbar. Für einen GitHub-Nutzernamen ist das unkritisch —
 * der ist ohnehin öffentlich. Ein echtes Secret gehört hier niemals hin.
 */
const konfigurierterNutzername = import.meta.env.VITE_GITHUB_USERNAME?.trim();

/**
 * Fällt auf den Namen des Repository-Eigentümers zurück, wenn die Variable beim
 * Build fehlt oder leer ist. Ohne diesen Fallback würde ein vergessener
 * Workflow-Parameter eine leere Seite ausliefern, statt laut zu scheitern —
 * und still leer ist die schlechtere Fehlerart.
 */
export const GITHUB_USERNAME = konfigurierterNutzername || "alex1009-system32";

export const GITHUB_API_BASE_URL = "https://api.github.com";
