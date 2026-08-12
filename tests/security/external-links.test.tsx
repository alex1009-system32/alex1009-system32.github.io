import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../helpers/render";
import App from "../../src/App";

/**
 * Sichert die Funde S1 (target="_blank" ohne rel) und B8 (img ohne alt) aus
 * `RESTRUCTURE-PLAN.md` ab. Beide wurden in Umbauschritt 1 bereits behoben —
 * die Tests halten den Fix fest, damit er bei den Schritten 4 und 5, wenn die
 * Komponenten verschoben und umbenannt werden, nicht verloren geht.
 */
describe("Externe Links", () => {
  it("öffnet Repository-Links in einem neuen Tab", async () => {
    renderWithProviders(<App />);

    const links = await screen.findAllByRole("link", {
      name: ">> COURCE CODE",
    });
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
    }
  });

  it("entkoppelt jeden Link mit target='_blank' über rel='noopener noreferrer'", async () => {
    renderWithProviders(<App />);

    await screen.findAllByRole("link", { name: ">> COURCE CODE" });

    const blankLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(blankLinks.length).toBeGreaterThan(0);
    for (const link of blankLinks) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

describe("Bilder", () => {
  it("gibt dem Profilbild einen Ersatztext", async () => {
    renderWithProviders(<App />);

    const bild = await screen.findByRole("img");
    expect(bild).toHaveAccessibleName("Profile picture of Test User");
  });
});
