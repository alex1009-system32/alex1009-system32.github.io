import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../helpers/render";
import App from "@/app/App";

/**
 * Die Projektliste ist der einzige interaktive Teil der Seite und war der Ort,
 * an dem das `key`-Prop fehlte (Umbauschritt 3). Das Nachladen über "Show More"
 * ist deshalb der Test, der beweist, dass die Liste unverändert rekonziliert.
 */
describe("Projektliste", () => {
  it("zeigt zunächst nur die ersten drei Repositories", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("CASE_FILE_101: alpha-tool")).toBeVisible();
    expect(screen.getByText("CASE_FILE_102: beta-lib")).toBeVisible();
    expect(screen.getByText("CASE_FILE_103: gamma-cli")).toBeVisible();

    expect(screen.queryByText("CASE_FILE_104: delta-api")).toBeNull();
    expect(screen.queryByText("CASE_FILE_105: epsilon-web")).toBeNull();
  });

  it("lädt über 'Show More' drei weitere Einträge nach und behält die bisherigen", async () => {
    const nutzer = userEvent.setup();
    renderWithProviders(<App />);

    await nutzer.click(
      await screen.findByRole("button", { name: "Show More" }),
    );

    expect(screen.getByText("CASE_FILE_101: alpha-tool")).toBeVisible();
    expect(screen.getByText("CASE_FILE_104: delta-api")).toBeVisible();
    expect(screen.getByText("CASE_FILE_105: epsilon-web")).toBeVisible();
  });

  it("blendet den Button aus, sobald alle Repositories sichtbar sind", async () => {
    const nutzer = userEvent.setup();
    renderWithProviders(<App />);

    await nutzer.click(
      await screen.findByRole("button", { name: "Show More" }),
    );

    expect(screen.queryByRole("button", { name: "Show More" })).toBeNull();
  });

  it("zeigt Aktualisierungsdatum, Status und Sprache je Eintrag", async () => {
    renderWithProviders(<App />);

    expect(
      await screen.findByText("LAST-Updated: 2026-01-15T10:00:00Z"),
    ).toBeVisible();
    expect(screen.getByText("LANGUAGE: TypeScript")).toBeVisible();

    // Von den drei initial sichtbaren Repos sind zwei aktiv und eines archiviert.
    expect(screen.getAllByText("STATUS: Live")).toHaveLength(2);
    expect(screen.getAllByText("STATUS: Archived")).toHaveLength(1);
  });

  it("kennzeichnet archivierte Repositories als 'Archived'", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("STATUS: Archived")).toBeVisible();
  });

  it("setzt 'Mixed' ein, wenn die API keine Sprache liefert", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("LANGUAGE: Mixed")).toBeVisible();
  });

  it("setzt einen Ersatztext ein, wenn die Beschreibung fehlt", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("No description provided.")).toBeVisible();
    expect(screen.getByText("Erstes Repository")).toBeVisible();
  });

  it("verlinkt jedes Repository unter dem Label '>> SOURCE CODE'", async () => {
    renderWithProviders(<App />);

    const links = await screen.findAllByRole("link", {
      name: ">> SOURCE CODE",
    });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      "https://github.com/testuser/alpha-tool",
    );
  });
});
