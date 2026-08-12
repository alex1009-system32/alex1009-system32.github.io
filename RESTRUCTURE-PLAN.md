# Restructure Plan — my-portfolio (alex1009-system32.github.io)
_Analyse: 2026-08-12 · **alle Schritte 1–7 umgesetzt am 2026-08-12**_

> **Stand der Umsetzung — abgeschlossen**
> Die Schritte 1–5 liefen ohne jede sichtbare Änderung; belegt durch den über die
> Schritte 3, 4 und 5 hinweg **unveränderten CSS-Bundle-Hash** (`index-BZrEso5m.css`).
> Die Schritte 6 und 7 wurden anschließend einzeln entschieden und umgesetzt — sie
> ändern das Aussehen und den Text der Seite bewusst. 21 Tests grün.

## Kurzfassung

Das Projekt ist klein (9 Quelldateien, 311 Zeilen) und im Kern gesund: es gibt **keine
Secrets**, keine Auth-Fläche, kein `dangerouslySetInnerHTML` und keinen Datenabfluss —
die Anwendung liest ausschließlich öffentliche GitHub-Daten. Der Build läuft grün.

Das eigentliche Problem ist eine Gruppe von **stillen Fehlgriffen im Styling**: die
`tailwind.config.ts` wird von Tailwind v4 gar nicht gelesen, drei Farbklassen sind im
`@theme` nie definiert und der Textur-Hintergrund erzeugt ungültiges CSS. Alle drei
Punkte sind am gebauten Bundle verifiziert — die Seite sieht heute anders aus, als der
Code es beabsichtigt, und niemand bekommt eine Fehlermeldung. Dazu kommen zwei echte
Korrektheitsmängel: fehlende `key`-Props in beiden Listen und ein komplett
abgeschaltetes `strict` in allen tsconfigs, wodurch `any` bis in die Komponenten
durchschlägt (der Lint bricht deshalb aktuell mit 2 Fehlern).

Der Umbau bringt: grüner Lint, scharfer Typecheck mit echten API-Typen, eine klare
Trennung von Datenzugriff und Darstellung — und vor allem sichtbares Styling, das dem
entspricht, was im Code steht.

## Befunde

### Achse 1 — Architektur & Schichtung

| # | Fund | Fundstelle | Schwere | Auswirkung |
|---|------|-----------|---------|------------|
| A1 | `services/` mischt HTTP-Zugriff und React-Query-Hooks; kein zentraler HTTP-Client, URL zweimal literal gebaut | `src/services/githubService.ts:2,15` | mittel | Basis-URL und Fehlerbehandlung an zwei Stellen zu pflegen |
| A2 | Response-Mapping (API-DTO → View-Modell) steckt im `select` der Hooks; es existieren **keine** Response-Typen | `src/services/useGithub.ts:12-21,32-37` | mittel | `any` wandert bis in die Komponente, Typprüfung ist wirkungslos |
| A3 | `username` als Konstante in der Komponente statt in der Konfiguration | `src/App.tsx:7` | niedrig | Konfiguration im Rendering-Code |
| A4 | `useState` als Konstantenspeicher für das Datum — Wert friert beim ersten Render ein | `src/components/Header.tsx:9` | niedrig | Anti-Pattern; bei langer Sitzung veraltetes Datum |
| A5 | Jede Komponente rendert ihren eigenen Lade-/Fehlerblock; im Ladezustand erscheint dreimal „Loading…" untereinander | `Header.tsx:13-19`, `About.tsx:10-16`, `Project.tsx:16-22` | mittel | Kopiertes Muster, uneinheitliche Seitenoptik beim Laden |

### Achse 2 — Konsistenz

| # | Fund | Fundstelle | Schwere | Auswirkung |
|---|------|-----------|---------|------------|
| K1 | Datei `Project.tsx` exportiert Komponente `Projects`; Hook `useGitHubRepo` (Singular) liefert eine Liste | `Project.tsx:8,81`, `useGithub.ts:4` | mittel | Datei- und Symbolname stimmen nicht überein |
| K2 | Schreibweise „GitHub" uneinheitlich: `useGithub.ts` vs. `githubService.ts` vs. `fetchGitHubUser` | `src/services/*` | niedrig | Import-Pfade nicht erratbar |
| K3 | Keine Pfad-Aliase; Importe über `../services/…` | `Header.tsx:2`, `About.tsx:1`, `Project.tsx:2` | niedrig | Verschieben von Dateien zieht Pfadanpassungen nach sich |
| K4 | `staleTime` nur beim Repo-Query gesetzt, beim User-Query nicht | `useGithub.ts:9` vs. `:30` | niedrig | Uneinheitliche Cache-Politik ohne erkennbaren Grund |
| K5 | Globales CSS über `<link>` in der HTML statt Import im Einstiegspunkt | `index.html:7` | niedrig | Style liegt außerhalb des Modulgraphen, untypisch für Vite |
| K6 | Import steht nach ausführbarem Code | `main.tsx:5,7` | niedrig | Lesefluss; Imports werden ohnehin gehoisted |
| K7 | Props-Typen uneinheitlich benannt (`HeaderProps`, `AboutProps`, `ProjectProps`), keine dokumentierte Datei-Reihenfolge | alle Komponenten | niedrig | Jede Datei muss neu gelesen werden |
| K8 | ESLint `ecmaVersion: 2020` gegen tsconfig `target: es2023` | `eslint.config.js:19` | niedrig | Lint und Compiler bewerten dieselbe Syntax verschieden |

### Achse 3 — Security

Die Checkliste wurde vollständig durchgegangen. **Ohne Befund** (positiv festgehalten):
keine `.env`-Dateien, keine `VITE_*`-Variablen, kein `import.meta.env`-Zugriff, keine
hartkodierten Keys oder Tokens, kein `dangerouslySetInnerHTML`, kein `eval`/`new
Function`, keine direkte DOM-Manipulation, kein `postMessage`, kein `iframe`, kein
`localStorage`/`sessionStorage`, kein Token-Handling, keine Auth- oder Rollenlogik,
keine `console.log`, kein Fremd-CDN in `index.html`, `build.sourcemap` nicht aktiviert,
Lockfile eingecheckt. Die GitHub-API wird unauthentifiziert aufgerufen — es gibt also
kein Geheimnis, das ins Bundle geraten könnte.

| # | Fund | Fundstelle | Schwere | Auswirkung |
|---|------|-----------|---------|------------|
| S1 | `target="_blank"` ohne `rel="noopener noreferrer"` | `Project.tsx:54-58` | mittel | Moderne Browser setzen `noopener` implizit; explizit ist trotzdem Pflicht |
| S2 | `npm audit`: 6 Findings (5 hoch, 1 niedrig) — **ausschließlich in devDependencies** (`vite`, `postcss`, `nanoid`, `js-yaml`, `brace-expansion`, `@babel/core`) | `package.json:17-31` | mittel | Kein Code davon landet im Client-Bundle; betroffen ist die Build-Umgebung inkl. GitHub Actions |
| S3 | Deploy-Workflow nutzt `npm install` statt `npm ci` trotz eingechecktem Lockfile | `.github/workflows/deploy.yml:17` | mittel | Deployter Build kann von der geprüften Abhängigkeitsmenge abweichen |
| S4 | Keine Content-Security-Policy | `index.html` | mittel | Zweite Verteidigungslinie fehlt; GitHub Pages setzt keine Header, nur `<meta http-equiv>` möglich |
| S5 | `href`/`src` direkt aus API-Antwort ohne Schema-Prüfung | `Project.tsx:56`, `Header.tsx:43` | niedrig | Quelle ist die GitHub-API und damit vertrauenswürdig — aber durch `any` (A2) findet keinerlei Prüfung statt |
| S6 | `.gitignore` deckt `.env` nicht ab (`*.local` fängt nur `.env.local`) | `.gitignore:13` | niedrig | Präventiv: eine später angelegte `.env` würde eingecheckt |

**Kein Fund erfordert eine Rotation** — es wurde kein Secret ausgeliefert.
**Offene Frage ans Backend:** entfällt, die App hat kein eigenes Backend.

### Achse 4 — Redundanz & tote Elemente

| # | Fund | Fundstelle | Schwere | Auswirkung |
|---|------|-----------|---------|------------|
| R1 | **`tailwind.config.ts` ist wirkungslos.** Das Projekt nutzt Tailwind v4 (`@tailwindcss/vite`, `@import "tailwindcss"` + `@theme`); v4 liest keine `tailwind.config.ts` ohne `@config`-Direktive. Am Build verifiziert: `.font-mono` löst zum Tailwind-Standardstack auf, `.font-display` existiert im Bundle überhaupt nicht. Zusätzlich werden die Schriften nirgends geladen | `tailwind.config.ts` (ganze Datei), Nutzung in `App.tsx:12`, `Header.tsx:22`, `About.tsx:20,25`, `Skills.tsx:19,24`, `Project.tsx:26` | hoch | JetBrains Mono und Archivo Black sind nirgends aktiv — die Seite zeigt eine andere Schrift als beabsichtigt |
| R2 | **Farbklassen ohne Definition erzeugen kein CSS.** `wood-900` und `sand-800` fehlen im `@theme`; verifiziert: 0 Treffer im gebauten CSS | `Skills.tsx:24,25,27`, `About.tsx:25`, Definitionen in `globals.css:3-11` | hoch | Textfarbe und zwei Rahmen fallen still auf den geerbten Wert zurück |
| R3 | **Textur-Hintergrund erzeugt ungültiges CSS.** `bg-[https://…png]` wird zu `background-color://www.transparenttextures.com/…` und vom Browser verworfen; gemeint war `bg-[url(…)]` | `App.tsx:11` | hoch | Der Hintergrund wird nie dargestellt |
| R4 | `public/icons.svg` und `public/favicon.svg` werden nirgends referenziert — kein Import in `src`, kein `<link rel="icon">` | `public/*`, `index.html` | niedrig | Tote Assets; die Seite hat aktuell kein Favicon |
| R5 | `useGitHubUser(username)` wird zweimal aufgerufen; Lade-/Fehlerzweige dreimal kopiert | `Header.tsx:11`, `About.tsx:8` | niedrig | React Query dedupliziert den Request — der kopierte Code bleibt |
| R6 | `README.md` ist unverändert das Vite-Template | `README.md` | niedrig | Beschreibt das Projekt nicht |
| R7 | Root-`tsconfig.json` setzt `noUnusedLocals`/`noUnusedParameters: false` in einer Solution-Datei mit `files: []` — `compilerOptions` werden dort nicht an referenzierte Projekte vererbt | `tsconfig.json:7-10` | niedrig | Wirkungslose Konfiguration, die Gegenteiliges suggeriert |

### Korrektheit (Bug-Scan)

| # | Fund | Fundstelle | Schwere | Auswirkung |
|---|------|-----------|---------|------------|
| B1 | **Fehlendes `key`-Prop** in beiden `.map()`-Listen | `Skills.tsx:26-28`, `Project.tsx:33-64` | hoch | React-Warnung; beim „Show More" wird die Liste fehlerhaft rekonziliert |
| B2 | **`strict` in keiner tsconfig gesetzt** → `strictNullChecks` aus | `tsconfig.app.json`, `tsconfig.node.json` | hoch | `user?.` täuscht Sicherheit vor; `repos.slice()` (`Project.tsx:33`) ist ungeprüft |
| B3 | `any` an zwei Stellen — **bricht aktuell den Lint** (verifiziert: 2 Fehler) | `useGithub.ts:13`, `Project.tsx:33` | hoch | `npm run lint` ist rot; keine Typprüfung auf API-Daten |
| B4 | Lose Gleichheit `repo.archived == true` | `Project.tsx:44` | niedrig | Funktioniert hier, ist aber inkonsistent |
| B5 | Abschnittsnummerierung doppelt: „02. SKILLS" und „02. Projects" | `Skills.tsx:20`, `Project.tsx:28` | niedrig | **Sichtbar** — sollte „03." sein |
| B6 | Tippfehler im sichtbaren Text: „Porjects", „COURCE CODE", „Archivid" | `Header.tsx:36`, `Project.tsx:59`, `Project.tsx:44` | niedrig | **Sichtbar** |
| B7 | Variablenname `visibileCount` verschrieben | `Project.tsx:9,13,33,65` | niedrig | Lesbarkeit |
| B8 | `<img>` ohne `alt` | `Header.tsx:40-43` | mittel | Screenreader liest keinen Ersatztext |
| B9 | `mt-9` und `mt-12` gleichzeitig in einer `className` | `About.tsx:20` | niedrig | Widersprüchlich; die spätere Klasse gewinnt |
| B10 | `skills.sort()` mutiert das Array während des Renderns | `Skills.tsx:15` | niedrig | Hier unkritisch (Array wird je Render neu erzeugt), als Ableitung aber falsch platziert |

## Zielstruktur

Bei 9 Dateien wäre ein vollständiger Feature-First-Schnitt Overhead. Vorgeschlagen ist
die kleinste Struktur, die Datenzugriff, Seitenabschnitte und generische Bausteine
sauber trennt — mit genau einem Feature (`github`), weil es genau eine Datenquelle gibt.

```
vorher                          nachher
src/                            src/
├── main.tsx                    ├── main.tsx              # nur Provider-Kette + Mount
├── App.tsx                     ├── app/
├── components/                 │   ├── App.tsx           # Seitengerüst, sonst nichts
│   ├── About.tsx               │   └── providers.tsx     # QueryClient, künftig ErrorBoundary
│   ├── Header.tsx              ├── features/github/
│   ├── Project.tsx             │   ├── api/githubApi.ts  # fetch + zentrale Fehlerbehandlung
│   └── Skills.tsx              │   ├── hooks/useGitHubUser.ts
├── services/                   │   ├── hooks/useGitHubRepos.ts
│   ├── githubService.ts        │   ├── types.ts          # API-DTOs + View-Modelle
│   └── useGithub.ts            │   └── index.ts          # öffentliche Schnittstelle
└── styles/globals.css          ├── sections/             # die Abschnitte der Seite
                                │   ├── Header.tsx
                                │   ├── About.tsx
                                │   ├── Skills.tsx
                                │   └── Projects.tsx
                                ├── components/ui/
                                │   └── QueryState.tsx    # ein Lade-/Fehlermuster für alle
                                ├── lib/config.ts         # username, API-Basis-URL
                                └── styles/globals.css
```

| Ordner | Gehört rein | Gehört nicht rein |
|---|---|---|
| `app/` | Einstieg, Provider-Kette, Seitengerüst | Fachlogik, Datenzugriff |
| `features/github/` | Requests, Typen, Query-Hooks, Mapping | JSX der Seitenabschnitte |
| `sections/` | die vier sichtbaren Seitenabschnitte | `fetch`, Mapping-Logik |
| `components/ui/` | generisch, fachlich ahnungslos | Wissen über GitHub-Daten |
| `lib/` | Konfiguration, Formatierung, Helfer | React-Komponenten |

**Abhängigkeitsrichtung:** `sections/` → `features/github` (nur über dessen `index.ts`)
→ `lib/`. Nie umgekehrt.

## Dateikonventionen

Verbindlich nach dem Umbau, abgeleitet aus dem, was das Projekt schon überwiegend tut:

- **Benennung:** Komponentendateien `PascalCase.tsx`, alles andere `camelCase.ts`,
  Ordner `kebab-case`. Hooks beginnen mit `use`. Marke einheitlich `GitHub` (großes H)
  in Datei- und Symbolnamen.
- **Dateiname = Komponentenname.** `Projects.tsx` exportiert `Projects`, nicht `Project`.
- **Export:** ein Default-Export pro Komponentendatei (bestehende Praxis wird
  beibehalten), named exports für alles Übrige.
- **Reihenfolge in einer Komponentendatei:** Imports (extern → Alias → relativ) → Typen
  und `Props` → Komponente → Hooks → abgeleitete Werte → Handler → Return.
- **Props-Typ** heißt einheitlich `Props`, immer explizit als `type Props = { … }`.
- **Eigener Ordner** für eine Komponente erst, wenn Geschwisterdateien dazukommen.
- **Barrel-Datei** (`index.ts`) nur auf Feature-Ebene, nicht in jedem Unterordner.
- **Importe über Alias `@/`**, nicht über `../../`. Alias in `vite.config.ts` **und**
  `tsconfig.app.json` gesetzt.

## Umbauschritte

Reihenfolge: Security-Hygiene → Sicherheitsnetz → Korrektheit → Schichtung → Konsistenz
→ tote Elemente → sichtbare Textkorrekturen. Nach jedem Schritt bleibt die App lauffähig.

| # | Status | Ziel | Dateien | Verhaltensänderung | Prüfung |
|---|--------|------|---------|--------------------|---------|
| 1 | ✅ `9dac13d` | Security-Hygiene: `rel="noopener noreferrer"` (S1), `alt`-Attribut (B8), `.env` in `.gitignore` (S6), `npm ci` im Workflow (S3), `npm audit fix` für devDeps (S2) | `Project.tsx`, `Header.tsx`, `.gitignore`, `deploy.yml`, `package-lock.json` | **nein** (`alt` ist neu für Screenreader, optisch identisch) | `tsc -b`, `vite build`, `npm audit` |
| 2 | ✅ `cb02dd6` | Sicherheitsnetz: Vitest + Testing Library aufsetzen, Characterization Tests schreiben (Phase 3) | `package.json`, `vite.config.ts`, `tests/` | nein | Baseline über Test-Skill, muss grün sein |
| 3 | ✅ `b4de3ac` | Korrektheit: `strict: true` (B2), `key`-Props (B1), API-Typen statt `any` (B3, A2), `===` (B4) | `tsconfig.app.json`, `tsconfig.node.json`, `Skills.tsx`, `Project.tsx`, `useGithub.ts` | **nein** (`key` behebt eine latente Rekonziliations-Macke beim „Show More") | `tsc -b`, **`npm run lint` wird grün**, Tests aus Schritt 2 |
| 4 | ✅ `b019dba` | Schichtung: `features/github/` mit `api`/`hooks`/`types`/`index.ts`, `lib/config.ts` für `username` (A1, A2, A3), `QueryState`-Komponente gegen den dreifach kopierten Lade-/Fehlerblock (A5, R5) | `src/services/*` → `src/features/github/*`, `src/components/ui/QueryState.tsx`, `App.tsx` | **nein** (entschieden) — die Abschnitte kehren weiterhin einzeln früh zurück, es wird nur das kopierte Markup zusammengefasst. Drei Ladehinweise bleiben drei, per Test abgesichert | `tsc -b`, `vite build`, Tests |
| 5 | ✅ `fc5b1b4` | Konsistenz: Alias `@/` (K3), Umbenennungen `Project.tsx`→`Projects.tsx`, `useGithub`→Feature-Hooks (K1, K2), CSS-Import in `main.tsx` (K5), Import-Reihenfolge (K6), Props-Konvention (K7), ESLint `ecmaVersion` (K8), tote Root-`compilerOptions` entfernen (R7), `staleTime` vereinheitlichen (K4), `visibileCount` (B7), `mt-9`/`mt-12` (B9), `skills`-Sortierung aus dem Render heraus (B10), `useState` fürs Datum auflösen (A4) | alle Quelldateien, `index.html`, `eslint.config.js`, `tsconfig.*`, `vite.config.ts` | **nein** | `tsc -b`, `vite build`, `npm run lint`, Tests |
| 6 | ✅ `ca441cd` | Tote Elemente & Styling-Fehlgriffe: `tailwind.config.ts` (R1), fehlende Farben im `@theme` (R2), `bg-[url(…)]` (R3), Favicon verlinken oder Assets löschen (R4), README neu (R6) | `tailwind.config.ts`, `globals.css`, `App.tsx`, `Skills.tsx`, `About.tsx`, `index.html`, `README.md` | **ja** — siehe Risiken. Hier wird die Seite sichtbar anders | `vite build` + CSS-Bundle prüfen, Sichtprüfung |
| 7 | ✅ `87fb4b4` | Sichtbare Textkorrekturen: „Porjects", „COURCE CODE", „Archivid" (B6), „02." → „03." (B5) | `Header.tsx`, `Project.tsx` | **ja** — geänderter Text auf der Seite | Sichtprüfung, Tests anpassen |

## Bewusst nicht angefasst

- **Kein Router.** Die Seite ist einseitig; `react-router` einzuführen wäre Ballast
  ohne Nutzen. Lazy-Loading auf Routenebene entfällt damit ebenfalls.
- **Kein globaler Store.** Es gibt keinen geteilten Client-State — React Query deckt
  den gesamten Server-State ab. Die Vier-Ebenen-Zuordnung ist bereits korrekt.
- **Rate-Limit der GitHub-API.** Unauthentifiziert sind es 60 Requests pro Stunde und
  IP. Bei einem Portfolio unkritisch, aber der Grund, warum die Seite gelegentlich nur
  „Error: API rate limit exceeded" zeigt. Eine Lösung (Build-Zeit-Fetch oder Caching-
  Proxy) ist ein eigenes Vorhaben, kein Refactoring-Schritt.
- **CSP (S4).** Über `<meta http-equiv>` machbar, würde aber mit dem Textur-Hintergrund
  aus Schritt 6 zusammenspielen müssen. Vorschlag: nach Schritt 6 separat entscheiden.
- **Wechsel des Styling-Ansatzes.** Tailwind wird konsequent genutzt, es gibt keine
  CSS-Module und keine Inline-Styles — hier ist nichts zu vereinheitlichen.

## Risiken & Rollback

**Wo Regressionen wahrscheinlich sind**

1. **Schritt 6 verändert das Aussehen — und zwar absichtlich.** Heute sind Schrift,
   zwei Rahmen, eine Textfarbe und der Hintergrund still wirkungslos. Werden sie
   repariert, sieht die Seite zum ersten Mal so aus, wie der Code sie meint. Das ist
   das erklärte Ziel, aber es ist **keine verhaltensneutrale Änderung**. Für jeden der
   vier Punkte gibt es zwei legitime Wege — reparieren oder die tote Deklaration
   entfernen. Diese Entscheidung gehört dir, Datei für Datei, bevor ich anfange.
2. **Schriften-Nachladen (R1).** JetBrains Mono und Archivo Black sind nirgends
   eingebunden. Sie zu aktivieren heißt, sie auch zu laden — als lokales Asset (kein
   Fremd-Request, empfohlen) oder über Google Fonts (Fremd-Request, DSGVO-relevant,
   und Interaktion mit einer künftigen CSP).
3. **Textur-Hintergrund (R3).** Repariert lädt die Seite ein Bild von
   `transparenttextures.com` — ein Third-Party-Request, der heute faktisch nicht
   stattfindet. Alternative: die Textur ins `public/`-Verzeichnis legen.
4. **Schritt 4, `QueryState`.** Drei separate „Loading…"-Zeilen werden zu einer. Das
   ist sichtbar, deshalb im Plan als *zu klären* markiert.
5. **Schritt 3, `strict: true`.** Kann bislang verborgene Typfehler aufdecken. Erwartung
   bei dieser Codegröße: wenige, alle mechanisch behebbar. Falls es doch mehr werden,
   melde ich das, statt sie mit `!` zuzukleistern.

**Was an Tests fehlt:** alles. Es gibt keinen Test-Runner, keinen Test und keine CI-
Prüfung außer dem Build. Schritt 2 legt die Grundlage; ohne diesen Schritt sind die
Schritte 4–7 nur durch Sichtprüfung abgesichert.

**Rollback:** ein Commit pro Schritt auf `claude/charming-faraday-e3emt2`, kein Push
ohne deine Freigabe. Jeder Schritt ist einzeln über `git revert` zurücknehmbar; der
`main`-Branch bleibt bis zum Merge unberührt.

## Freigabe

Freigegeben wurden die **Schritte 1–5** (der strukturelle Umbau ohne sichtbare
Änderungen) inklusive Testnetz. Die Schritte 6 und 7 sind offen — für Schritt 6 braucht
es zu jedem der vier Styling-Punkte eine Entscheidung: reparieren oder tote Deklaration
entfernen.

---

## Abschluss der Schritte 1–5

_2026-08-12_

### Abgleich Plan ↔ Umsetzung

| Schritt | Ergebnis |
|---|---|
| 1 Security-Hygiene | erledigt. `npm audit` von 6 Findings (5 hoch) auf **0** |
| 2 Testnetz | erledigt. Vitest + Testing Library + MSW, 21 Tests, Baseline grün |
| 3 Korrektheit | erledigt. `npm run lint` von 2 Fehlern auf **grün**; `strict: true` deckte **keinen** verborgenen Typfehler auf |
| 4 Schichtung | erledigt. Der als *zu klären* markierte Punkt wurde zugunsten „keine sichtbare Änderung" entschieden |
| 5 Konsistenz | erledigt. Abweichung vom Plan: `baseUrl` beim Alias entfällt — in TypeScript 6 deprecated, bricht sonst den Build |
| 6 Tote Elemente & Styling | erledigt. Vier Einzelentscheidungen, siehe unten. CSS 11,49 → **9,59 kB** |
| 7 Textkorrekturen | erledigt. Sieben Tests schlugen erwartungsgemäß an und wurden nachgezogen |

**Vorgezogen aus Schritt 5:** Die in Schritt 4 neu angelegten Hook-Dateien tragen direkt
die Zielnamen (`useGitHubUser`, `useGitHubRepos`), statt erst unter dem alten Namen
angelegt und dann umbenannt zu werden.

### Verifikation

- `tsc -b --force`, `npm run lint`, `npm run build`, `npm audit` — alle ohne Befund
- 21/21 Tests grün, über fünf Läufe stabil, keine `act`-Warnungen
- **CSS-Bundle-Hash über die Schritte 3, 4 und 5 unverändert** (`index-BZrEso5m.css`) —
  der Beleg, dass am Styling nichts passiert ist
- Bundle-Abgleich: keine Secret-Muster, keine Sourcemaps, als externe Hosts nur
  `api.github.com`, die Fehlermeldungs-URLs der Libraries und der SVG-Namespace.
  Größe praktisch unverändert (JS 229,51 → 229,53 kB; CSS 11,12 → 11,49 kB)
- Klickdurchlauf im echten Chromium gegen das Produktions-Bundle (API im Browser
  gestubbt): Seite lädt, „Show More" erweitert von 3 auf 5 Einträge, Button verschwindet,
  keine React-Warnungen

### Übergabe-Notiz (für README oder CONTRIBUTING.md)

> **Ordnerlogik.** `app/` hält Einstieg, Provider-Kette und Seitengerüst. `features/<name>/`
> enthält alles Fachliche einer Datenquelle — `api/`, `hooks/`, `types.ts` — und wird
> ausschließlich über sein `index.ts` benutzt, nie über interne Pfade. `sections/` sind
> die sichtbaren Abschnitte der Seite, `components/ui/` die generischen Bausteine ohne
> Fachwissen, `lib/` die Konfiguration. Abhängigkeiten laufen nur abwärts:
> `sections → features → lib`.
>
> **Dateikonventionen.** Komponentendateien `PascalCase.tsx` mit einem Default-Export,
> der so heißt wie die Datei; alles andere `camelCase.ts`. Props immer explizit als
> `type Props = { … }`. Reihenfolge in der Datei: Imports → Typen → Komponente → Hooks →
> abgeleitete Werte → Handler → Return. Importe über den Alias `@/`, nie über `../../`.
>
> **Vor dem Commit:** `npm run lint && npm test && npm run build`.


## Nachtrag: Schritte 6 und 7

_2026-08-12_

### Getroffene Entscheidungen (Schritt 6)

| Fund | Entscheidung | Folge |
|---|---|---|
| R1 Schriften | `tailwind.config.ts` **gelöscht**, Standard-Monospace behalten | Keine sichtbare Änderung. Die Datei war seit dem Wechsel auf Tailwind v4 wirkungslos und täuschte eine Konfiguration vor, die nie griff |
| R2 Farben | `wood-900` und `sand-800` im `@theme` **ergänzt** | Sichtbar: Text im ABOUT- und SKILLS-Abschnitt sowie zwei Rahmen erscheinen jetzt in der gemeinten Farbe statt in der geerbten |
| R3 Textur | `bg-[url(…)]` **korrigiert, extern geladen** | Sichtbar: Die Seite lädt bei jedem Besuch ein Bild von `transparenttextures.com`. Damit hängt die Darstellung an einem fremden Host |
| R4 Favicon | `favicon.svg` **verlinkt** | Der bisherige 404 auf `/favicon.ico` entfällt. `public/icons.svg` bleibt ungenutzt liegen — dazu steht eine Entscheidung aus |

### Neuer Befund während der Umsetzung (nicht aus der Analyse)

**Tailwind v4 scannte das gesamte Projekt**, einschließlich `RESTRUCTURE-PLAN.md` und
`TEST-REPORT.md`, und baute Klassennamen aus deren Fließtext als echte Utilities ins
Bundle — darunter ausgerechnet die in diesem Dokument beschriebene kaputte Regel
`background-color://…png`. Der Befund entstand erst durch die Dokumentationsdateien
dieses Umbaus, war also selbst eingeschleppt und wurde deshalb direkt behoben:
`@import "tailwindcss" source(none)` plus explizite `@source`-Einträge für `src/` und
`index.html`.

Ergebnis: **CSS von 11,49 auf 9,59 kB** (−17 %). Gegengeprüft, dass dabei nichts
Benötigtes verlorenging — alle **75** im Quellcode verwendeten Klassen sind weiterhin
im Bundle.

### Verifikation

- `tsc -b`, `npm run lint`, `npm run build`, `npm audit`: ohne Befund
- 21/21 Tests grün. Schritt 7 machte zunächst **7 Tests rot** — genau die, die die
  alten Texte festhielten. Das Sicherheitsnetz hat also gegriffen; Erwartungen und
  Manifest wurden mit der Korrektur nachgezogen
- Klickdurchlauf im echten Chromium: Texte korrekt, Nummerierung fortlaufend
  (01/02/03), „Show More" erweitert weiterhin 3 → 5 Einträge

**Nicht verifiziert:** ob die Textur tatsächlich erscheint. Der Sandbox-Proxy blockiert
`transparenttextures.com`. Die CSS-Regel ist korrekt, die Darstellung zeigt sich erst
im Deployment.

### Weiterhin offen

- **`public/icons.svg`** (Bluesky-Symbole) wird nirgends referenziert — löschen oder
  einbauen?
- **Rate-Limit-Fehlerpfad (E1 in `TEST-REPORT.md`).** Bei 60 Requests pro Stunde und IP
  rendert die Seite die rohe API-Meldung, und die enthält die IP-Adresse des Besuchers.
- **CSP (S4).** Jetzt konkreter zu entscheiden, da mit der externen Textur ein
  `img-src`-Eintrag für `transparenttextures.com` nötig würde.
- **Accessibility (E2, E5, E8).** Keine Überschriften-Semantik, keine Ansage von Lade-
  und Fehlerzuständen.
