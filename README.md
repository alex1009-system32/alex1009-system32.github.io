# my-portfolio

Einseitige Portfolio-Website, die Profil und öffentliche Repositories direkt aus der
GitHub-API lädt. Deployt als GitHub Pages unter
[alex1009-system32.github.io](https://alex1009-system32.github.io).

Die Seite besteht aus vier Abschnitten — Kopfbereich, `01. ABOUT`, `02. SKILLS` und
`03. Projects`. Name, Bio, Ort, Avatar und die Projektliste kommen zur Laufzeit von der
API; nur die Skills-Liste ist im Code gepflegt.

## Stack

| | |
|---|---|
| Build | Vite 8, TypeScript 6 (`strict`) |
| UI | React 19 |
| Styling | Tailwind CSS 4 (`@theme` in `src/styles/globals.css`, keine `tailwind.config`) |
| Daten | TanStack Query 5 |
| Tests | Vitest 4, Testing Library, MSW (jsdom) |

## Entwicklung

```bash
npm ci
npm run dev
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver mit HMR |
| `npm run build` | Typecheck (`tsc -b`) und Produktions-Build nach `dist/` |
| `npm run preview` | Den gebauten Stand lokal ausliefern |
| `npm run lint` | ESLint über das ganze Projekt |
| `npm test` | Testsuite einmal ausführen |
| `npm run test:watch` | Tests im Watch-Modus |

## Konfiguration

| Variable | Pflicht | Bedeutung |
|---|---|---|
| `VITE_GITHUB_USERNAME` | nein | GitHub-Nutzername, dessen Daten angezeigt werden. Fehlt sie oder ist sie leer, greift der Fallback in `src/lib/config.ts`. |

Für lokale Entwicklung `.env.example` nach `.env.local` kopieren und anpassen.

Im Deployment wird der Wert aus der Repository-Variable `PORTFOLIO_GITHUB_USERNAME`
gesetzt (*Settings → Secrets and variables → Actions → Variables*). Der Präfix `GITHUB_`
ist bei GitHub Actions reserviert und lässt sich für eigene Variablen nicht verwenden —
daher der abweichende Name.

> **Alles mit `VITE_`-Präfix wird beim Build ins Bundle inlined und ist für jeden
> Besucher im ausgelieferten JavaScript lesbar.** Hier gehören nur unkritische Werte
> hinein — niemals API-Keys, Tokens oder Passwörter. Ein GitHub-Nutzername ist ohnehin
> öffentlich, deshalb ist er hier unbedenklich.

## Projektstruktur

```
src/
├── main.tsx              # Einstieg: Provider-Kette montieren, sonst nichts
├── app/
│   ├── App.tsx           # Seitengerüst
│   └── providers.tsx     # Query-Client
├── features/github/      # alles Fachliche zur Datenquelle
│   ├── api/githubApi.ts  # der einzige Ort mit fetch, zentrale Fehlerbehandlung
│   ├── hooks/            # useGitHubUser, useGitHubRepos
│   ├── types.ts          # API-Antworten und aufbereitete View-Modelle
│   └── index.ts          # öffentliche Schnittstelle des Features
├── sections/             # die sichtbaren Abschnitte der Seite
├── components/ui/        # generische Bausteine ohne Fachwissen
├── lib/config.ts         # Nutzername, API-Basis-URL
└── styles/globals.css    # Tailwind-Import und Farbpalette
```

**Die Regel dahinter:** Abhängigkeiten laufen nur abwärts —
`sections → features → lib`, nie umgekehrt. Auf `features/github` wird ausschließlich
über dessen `index.ts` zugegriffen, nie auf interne Dateien.

## Dateikonventionen

- Komponentendateien `PascalCase.tsx` mit **einem** Default-Export, der so heißt wie die
  Datei. Alles andere `camelCase.ts`, Hooks beginnen mit `use`.
- Props immer explizit als `type Props = { … }`.
- Reihenfolge in einer Komponentendatei: Imports → Typen → Komponente → Hooks →
  abgeleitete Werte → Handler → Return.
- Importe über den Alias `@/`, nicht über `../../`. Der Alias ist in `vite.config.ts`
  **und** `tsconfig.app.json` gesetzt — beide müssen zusammenpassen.
- Barrel-Datei (`index.ts`) nur auf Feature-Ebene.

## Tests

```
tests/
├── characterization/   # Verhalten der Seite aus Nutzersicht
├── edge-cases/         # Konfiguration und Randfälle
├── security/           # rel="noopener", Ersatztexte
└── helpers/            # renderWithProviders, MSW-Handler und Fixtures
```

Abgefragt wird über Rollen, Labels und sichtbaren Text — nicht über CSS-Klassen oder
interne Komponentennamen. MSW fängt die GitHub-API ab; ein Test, der eine nicht
registrierte Adresse aufruft, schlägt fehl, statt still ins echte Netz zu gehen.

## Deployment

Jeder Push auf `main` baut die Seite und veröffentlicht sie über GitHub Pages
(`.github/workflows/deploy.yml`). Der Workflow nutzt `npm ci`, der Build läuft also
gegen die im Lockfile festgeschriebenen Abhängigkeiten.

## Vor dem Commit

```bash
npm run lint && npm test && npm run build
```

## Bekannte Einschränkungen

- **Rate-Limit.** Die GitHub-API wird unauthentifiziert aufgerufen — 60 Anfragen pro
  Stunde und IP. Danach zeigt die Seite die Fehlermeldung der API, und die enthält bei
  unauthentifizierten Anfragen die IP-Adresse des Besuchers.
- **Externer Hintergrund.** Die Textur wird von `transparenttextures.com` geladen; die
  Darstellung hängt damit an einem fremden Host.
- **Barrierefreiheit.** Die Abschnittsüberschriften sind `div`-Elemente ohne
  Überschriften-Semantik, Lade- und Fehlerzustände werden Screenreadern nicht angesagt.
