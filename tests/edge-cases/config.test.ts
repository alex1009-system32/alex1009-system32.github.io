import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `GITHUB_USERNAME` wird beim Laden des Moduls einmal aus `import.meta.env`
 * gelesen. Deshalb muss die Variable VOR dem Import gesetzt und das Modul je
 * Fall frisch geladen werden — sonst prüft jeder Test denselben Wert vom
 * ersten Import.
 */
async function ladeKonfigMit(wert?: string) {
  vi.resetModules();
  if (wert === undefined) {
    vi.stubEnv("VITE_GITHUB_USERNAME", "");
  } else {
    vi.stubEnv("VITE_GITHUB_USERNAME", wert);
  }
  return import("@/lib/config");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Nutzername aus der Umgebung", () => {
  it("übernimmt den Wert aus VITE_GITHUB_USERNAME", async () => {
    const { GITHUB_USERNAME } = await ladeKonfigMit("octocat");

    expect(GITHUB_USERNAME).toBe("octocat");
  });

  it("schneidet versehentliche Leerzeichen ab", async () => {
    const { GITHUB_USERNAME } = await ladeKonfigMit("  octocat  ");

    expect(GITHUB_USERNAME).toBe("octocat");
  });

  it("fällt bei fehlender Variable auf den Eigentümer zurück", async () => {
    const { GITHUB_USERNAME } = await ladeKonfigMit(undefined);

    expect(GITHUB_USERNAME).toBe("alex1009-system32");
  });

  it("fällt auch bei einer Variable aus reinem Leerraum zurück, statt leer abzufragen", async () => {
    const { GITHUB_USERNAME } = await ladeKonfigMit("   ");

    expect(GITHUB_USERNAME).toBe("alex1009-system32");
  });

  it("lässt die API-Basis-URL unverändert", async () => {
    const { GITHUB_API_BASE_URL } = await ladeKonfigMit("octocat");

    expect(GITHUB_API_BASE_URL).toBe("https://api.github.com");
  });
});
