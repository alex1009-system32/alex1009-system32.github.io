import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";

/**
 * Die Handler binden sich auf `:username` statt auf einen festen Namen — deshalb
 * tragen sie unverändert weiter, seit der Wert in Schritt 4 von `src/App.tsx` nach
 * `src/lib/config.ts` gewandert ist.
 */
export const USER_ENDPOINT = "https://api.github.com/users/:username";
export const REPOS_ENDPOINT = "https://api.github.com/users/:username/repos";

/** Rohform der GitHub-Antwort — genau die Felder, die `select` heute ausliest. */
export const userFixture = {
  name: "Test User",
  bio: "Building things in the open",
  avatar_url: "https://avatars.test/u/42.png",
  location: "Innsbruck",
};

/** Fünf Repos: mehr als die drei initial sichtbaren, damit "Show More" greift. */
export const reposFixture = [
  {
    id: 101,
    name: "alpha-tool",
    description: "Erstes Repository",
    svn_url: "https://github.com/testuser/alpha-tool",
    updated_at: "2026-01-15T10:00:00Z",
    archived: false,
    language: "TypeScript",
  },
  {
    id: 102,
    name: "beta-lib",
    description: null,
    svn_url: "https://github.com/testuser/beta-lib",
    updated_at: "2026-02-20T11:00:00Z",
    archived: true,
    language: null,
  },
  {
    id: 103,
    name: "gamma-cli",
    description: "Drittes Repository",
    svn_url: "https://github.com/testuser/gamma-cli",
    updated_at: "2026-03-25T12:00:00Z",
    archived: false,
    language: "Java",
  },
  {
    id: 104,
    name: "delta-api",
    description: "Viertes Repository",
    svn_url: "https://github.com/testuser/delta-api",
    updated_at: "2026-04-30T13:00:00Z",
    archived: false,
    language: "Go",
  },
  {
    id: 105,
    name: "epsilon-web",
    description: "Fuenftes Repository",
    svn_url: "https://github.com/testuser/epsilon-web",
    updated_at: "2026-05-05T14:00:00Z",
    archived: false,
    language: "Rust",
  },
];

export const handlers = [
  http.get(USER_ENDPOINT, () => HttpResponse.json(userFixture)),
  http.get(REPOS_ENDPOINT, () => HttpResponse.json(reposFixture)),
];

export const server = setupServer(...handlers);

/** Beide Endpunkte antworten mit einem GitHub-typischen Fehlerobjekt. */
export function failAllRequests(message = "Not Found") {
  return [
    http.get(USER_ENDPOINT, () =>
      HttpResponse.json({ message }, { status: 404 }),
    ),
    http.get(REPOS_ENDPOINT, () =>
      HttpResponse.json({ message }, { status: 404 }),
    ),
  ];
}

/** Beide Endpunkte hängen, damit der Ladezustand beobachtbar bleibt. */
export function stallAllRequests() {
  return [
    http.get(USER_ENDPOINT, async () => {
      await delay("infinite");
      return HttpResponse.json(userFixture);
    }),
    http.get(REPOS_ENDPOINT, async () => {
      await delay("infinite");
      return HttpResponse.json(reposFixture);
    }),
  ];
}
