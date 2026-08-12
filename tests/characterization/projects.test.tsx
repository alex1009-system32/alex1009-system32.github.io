import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../helpers/render";
import App from "../../src/app/App";

/**
 * Die Projektliste ist der einzige interaktive Teil der Seite und zugleich der
 * Ort, an dem heute das `key`-Prop fehlt (Umbauschritt 3). Das Nachladen über
 * "Show More" ist deshalb der Test, der nach dem Fix beweisen muss, dass die
 * Liste unverändert rekonziliert.
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
    expect(screen.getAllByText("STATUS: Archivid")).toHaveLength(1);
  });

  it("kennzeichnet archivierte Repositories als 'Archivid'", async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText("STATUS: Archivid")).toBeVisible();
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

  it("verlinkt jedes Repository unter dem Label '>> COURCE CODE'", async () => {
    renderWithProviders(<App />);

    const links = await screen.findAllByRole("link", {
      name: ">> COURCE CODE",
    });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      "https://github.com/testuser/alpha-tool",
    );
  });
});
