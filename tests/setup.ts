import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./helpers/server";

// Kein Test darf das Netz erreichen: unbekannte Requests brechen den Test ab,
// statt still gegen die echte GitHub-API zu laufen.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
