# Test-Report — my-portfolio (Frontend)
_Stand: 2026-08-12 · Baseline-Lauf für den Umbau nach `RESTRUCTURE-PLAN.md`_

## Umgebung

| | |
|---|---|
| Runner | Vitest 4.1.10 (`npm test` → `vitest run`) |
| Umgebung | jsdom 30 |
| Rendering | React Testing Library 16 + jest-dom 7 |
| Netzwerk | MSW 2.15, `onUnhandledRequest: "error"` — kein Test erreicht das echte Netz |
| Isolation | frischer Query-Client je Test (`retry: false`, `gcTime: 0`), `cleanup()` nach jedem Test |
| Manifest | `tests/restructure-tests.json` (`bereich: frontend`) |
| E2E | keine Suite vorhanden |

Browser-API-Stubs (`matchMedia`, `IntersectionObserver`, `ResizeObserver`, `scrollTo`)
werden nicht benötigt — die App nutzt keine davon.

## Ergebnis

**21 von 21 Tests grün**, über fünf aufeinanderfolgende Läufe stabil. Keine
`act`-Warnungen, keine unbehandelten Promise-Rejections nach Testende.

| Manifest-Eintrag | Erwartung | Ergebnis |
|---|---|---|
| `char-seite-geladen` | grün | grün (11 Tests) |
| `char-projektliste` | grün | grün (8 Tests) |
| `sec-externe-links-und-alt` | grün | grün (3 Tests) |

**Die Baseline ist bestätigt — der Umbau kann beginnen.**

### Der erste Lauf war rot — und warum das kein Produktivcode-Befund war

3 von 21 Tests fielen zunächst durch. Alle drei Ursachen lagen im Testcode, keine in der
Anwendung:

1. **`getByText` matcht nicht gegen `textContent`**, sondern nur gegen die *direkten*
   Text-Kindknoten eines Elements. In `About.tsx:26-27` steht „MISSION:" in einem eigenen
   `<span>`, die Bio als Textknoten daneben — die Regex `/^MISSION: …$/` konnte deshalb
   auf keinem Element greifen. Korrigiert: Label und Bio werden einzeln geprüft.
2. **`findAllByText` löst beim ersten Treffer auf.** Im Fehlerfall scheitern der
   User-Query und der Repo-Query unabhängig voneinander; der Test sah den Zwischenstand
   mit zwei statt drei Fehlerblöcken. Korrigiert: `waitFor` auf den Endzustand.
3. **Fixture-Kollision.** Unter den drei initial sichtbaren Repos sind zwei nicht
   archiviert, „STATUS: Live" kommt also doppelt vor und `getByText` bricht bei
   Mehrfachtreffern ab. Korrigiert: Prüfung auf die tatsächliche Anzahl.

Keine dieser Korrekturen schwächt eine Assertion ab — alle drei machen sie präziser.

### Kontrollfrage: sind die grünen Tests echt grün?

Negative Assertions (`queryBy… → null`) sind die häufigste Quelle trivial grüner Tests.
Alle vier im Bestand wurden geprüft: Jede negative Abfrage hat im **selben Test** ein
positives Gegenstück, das dieselbe Abfrageform nachweislich zum Treffer bringt (etwa
„Repo 101 ist sichtbar" neben „Repo 104 ist es nicht"). Keine greift ins Leere.

## Befunde

Keine. Der Produktivcode verhält sich in allen 21 geprüften Fällen wie erwartet.

## Fehlende Skill-Referenzen

`test-frontend/SKILL.md` verweist auf `references/edge-cases.md` und
`references/runner.md`. Beide Dateien existieren im installierten Skill nicht — das
Verzeichnis `references/` fehlt vollständig. Der Katalog der fünf Edge-Case-Kategorien
und die Report-Vorlage wurden deshalb aus den Kapitelüberschriften in `SKILL.md`
abgeleitet. Das ist eine Lücke im Skill, kein Projektproblem.

## Edge-Case-Kandidaten (noch nicht umgesetzt)

Priorisiert nach: (a) zeigt falsche Daten, (b) lässt Daten liegen, die geschützt gehören,
(c) macht die App für einen Teil der Nutzer unbedienbar.

### Hoch

| # | Fall | Was der Nutzer sieht | Kategorie |
|---|---|---|---|
| E1 | **GitHub-Rate-Limit (403).** Unauthentifiziert sind 60 Requests pro Stunde und IP erlaubt — der realistischste Ausfall dieser Seite | Dreimal die rohe API-Meldung. GitHub schreibt die **anfragende IP-Adresse in den `message`-Text**, und `Project.tsx:21` rendert ihn ungefiltert. Die Seite zeigt Besuchern damit ihre eigene IP | Netzwerk/Ausfall + Datenabfluss |
| E2 | **Keine Überschriften-Semantik.** „01. ABOUT", „02. SKILLS", „02. Projects" und der Name sind allesamt `<div>` | Screenreader-Nutzer haben keinerlei Navigationsstruktur; `getByRole("heading")` findet auf der ganzen Seite nichts | Accessibility |
| E3 | **Leerer Zustand.** Konto ohne öffentliche Repos | Überschrift „02. Projects" steht über einer leeren Fläche, ohne Hinweis, ohne Button | Zustands-/Ladepfade |

### Mittel

| # | Fall | Was der Nutzer sieht | Kategorie |
|---|---|---|---|
| E4 | **Antwort ist kein JSON** (HTML-Fehlerseite eines Proxys). `githubService.ts:7` ruft im Fehlerzweig `response.json()` auf — das wirft dann selbst | Ein kryptischer Parser-Fehler statt einer Fehlermeldung | Netzwerk/Ausfall |
| E5 | **Lade- und Fehlerzustände ohne `role="status"` / `role="alert"`** | Screenreader sagt weder „lädt" noch den Fehler an — der Wechsel passiert lautlos | Accessibility |
| E6 | **Genau 3 Repos** (Grenzfall `visibleCount === length`) | Button darf nicht erscheinen — heute korrekt, aber ungetestet | Zustands-/Ladepfade |
| E7 | **Netzwerkabbruch** (`fetch` rejected) | „Error: Failed to fetch" — technisch, nicht erklärend | Netzwerk/Ausfall |
| E8 | **„Show More" ohne Ansage.** Nach dem Klick erscheinen drei Einträge ohne Live-Region | Screenreader-Nutzer bemerken die neuen Einträge nicht | Accessibility |

### Nur als E2E prüfbar (kein Vitest-Fall)

- Farbkontrast der Palette (`wood-950` auf `sand-500`) — jsdom rechnet keine Farben.
- Echtes Fokus- und Tastaturverhalten nach dem Klick auf „Show More".
- Ob die Schriften tatsächlich laden — wird erst nach Umbauschritt 6 relevant.
- Layout- und Sichtbarkeitsfragen (`getBoundingClientRect` liefert in jsdom Nullen).

**E1 und E2 sind die beiden, die ich zuerst angehen würde.** E1 ist kein hypothetischer
Fall: Bei 60 Requests pro Stunde und IP trifft ihn jeder Besucher, sobald die Seite etwas
Verkehr bekommt — und der heutige Fehlerpfad gibt dabei die IP des Besuchers aus.
