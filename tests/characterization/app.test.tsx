import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../helpers/render";
import { failAllRequests, server, stallAllRequests } from "../helpers/server";
import App from "@/app/App";

/**
 * Characterization Tests: sie halten fest, was die Seite HEUTE tut — inklusive
 * der Tippfehler im sichtbaren Text ("Porjects", "COURCE CODE", "Archivid") und
 * der doppelt vergebenen Abschnittsnummer "02.". Das ist Absicht: Umbauschritt 7
 * würde genau diese Texte korrigieren, und dann sollen die Tests anschlagen,
 * damit die Änderung eine bewusste Entscheidung ist.
 */
describe("Portfolio-Seite — geladener Zustand", () => {
  it("zeigt Name, Ort und Tagline im Kopfbereich", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("Test User")).toBeVisible();
    expect(screen.getByText(/^Loc: Innsbruck$/)).toBeVisible();
    expect(screen.getByText("Working on Private Porjects")).toBeVisible();
  });

  it("zeigt das aktuelle Datum in der Kopfzeile", async () => {
    renderWithProviders(<App />);

    const heute = new Date().toLocaleDateString();
    expect(await screen.findByText(`Date: ${heute}`)).toBeVisible();
  });

  it("zeigt das Profilbild mit der Avatar-URL aus der API", async () => {
    renderWithProviders(<App />);

    const bild = await screen.findByRole("img", {
      name: "Profile picture of Test User",
    });
    expect(bild).toHaveAttribute("src", "https://avatars.test/u/42.png");
  });

  it("zeigt den Abschnitt ABOUT mit der Bio als MISSION", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("01. ABOUT")).toBeVisible();
    // Das Label steht in einem eigenen <span>, die Bio als Textknoten daneben —
    // deshalb werden beide einzeln geprueft statt als ein zusammenhaengender Text.
    expect(screen.getByText("MISSION:")).toBeVisible();
    expect(screen.getByText("Building things in the open")).toBeVisible();
  });

  it("zeigt alle Skills alphabetisch sortiert", async () => {
    renderWithProviders(<App />);

    expect(screen.getByText("02. SKILLS")).toBeVisible();

    const erwartet = [
      "Docker",
      "Express.js",
      "Git",
      "Java",
      "JavaFX",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "React",
      "Spring Boot",
    ];
    for (const skill of erwartet) {
      expect(screen.getByText(skill)).toBeVisible();
    }

    const container = screen.getByText("Java").parentElement;
    const sichtbar = Array.from(container?.children ?? []).map(
      (kind) => kind.textContent,
    );
    expect(sichtbar).toEqual(erwartet);
  });

  it("zeigt den Projektabschnitt unter der Nummer 02 (heute doppelt vergeben)", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("02. Projects")).toBeVisible();
    // "02. SKILLS" trägt dieselbe Nummer — der Ist-Zustand, den Schritt 7 korrigieren würde.
    expect(screen.getByText("02. SKILLS")).toBeVisible();
  });
});

describe("Portfolio-Seite — Ladezustand", () => {
  it("zeigt für jeden datenabhängigen Abschnitt einen eigenen Ladehinweis", async () => {
    server.use(...stallAllRequests());
    renderWithProviders(<App />);

    // Heute rendern Header, About und Projects je einen eigenen "Loading..."-Block.
    // Umbauschritt 4 fasst nur das Markup zusammen — die Anzahl muss gleich bleiben.
    const ladehinweise = await screen.findAllByText("Loading...");
    expect(ladehinweise).toHaveLength(3);
  });

  it("zeigt die Skills bereits, während die GitHub-Daten noch laden", async () => {
    server.use(...stallAllRequests());
    renderWithProviders(<App />);

    expect(await screen.findByText("02. SKILLS")).toBeVisible();
    expect(screen.getByText("Docker")).toBeVisible();
  });
});

describe("Portfolio-Seite — Fehlerzustand", () => {
  it("zeigt die Fehlermeldung der GitHub-API je datenabhängigem Abschnitt", async () => {
    server.use(...failAllRequests("API rate limit exceeded"));
    renderWithProviders(<App />);

    // Der User- und der Repo-Query scheitern unabhaengig voneinander. findAllByText
    // wuerde beim ersten Treffer aufloesen und den Zwischenstand mit zwei Bloecken
    // sehen — deshalb wird auf den Endzustand gewartet.
    await waitFor(() => {
      expect(
        screen.getAllByText("Error: API rate limit exceeded"),
      ).toHaveLength(3);
    });
  });

  it("blendet den Kopfbereich bei einem Fehler vollständig aus", async () => {
    server.use(...failAllRequests());
    renderWithProviders(<App />);

    await screen.findAllByText("Error: Not Found");
    expect(screen.queryByText("Working on Private Porjects")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
