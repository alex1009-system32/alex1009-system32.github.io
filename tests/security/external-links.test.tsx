import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../helpers/render";
import App from "@/app/App";

/**
 * Zwei Sicherheits- und Zugänglichkeitsgarantien, die leicht wieder verloren
 * gehen, wenn Komponenten verschoben oder umgebaut werden:
 * jeder `target="_blank"`-Link trägt `rel="noopener noreferrer"`, und das
 * Profilbild hat einen Ersatztext.
 */
describe("Externe Links", () => {
  it("öffnet Repository-Links in einem neuen Tab", async () => {
    renderWithProviders(<App />);

    const links = await screen.findAllByRole("link", {
      name: ">> SOURCE CODE",
    });
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
    }
  });

  it("entkoppelt jeden Link mit target='_blank' über rel='noopener noreferrer'", async () => {
    renderWithProviders(<App />);

    await screen.findAllByRole("link", { name: ">> SOURCE CODE" });

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
