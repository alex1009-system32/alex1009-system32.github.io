import type { ReactElement, ReactNode } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Frischer Query-Client pro Test: kein Cache-Leck zwischen Tests, keine Retries
 * (sonst wartet der Fehlerfall auf drei Wiederholungen).
 *
 * Umbau-Notiz (Schritt 4 erledigt): `src/app/providers.tsx` existiert jetzt, wird
 * hier aber bewusst NICHT verwendet — dort lebt ein Query-Client als Modul-Singleton,
 * über den Cache und Fehlerzustände zwischen Tests lecken würden.
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
}

export function renderWithProviders(ui: ReactElement): RenderResult {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
