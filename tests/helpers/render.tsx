import type { ReactElement, ReactNode } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Frischer Query-Client pro Test: kein Cache-Leck zwischen Tests, keine Retries
 * (sonst wartet der Fehlerfall auf drei Wiederholungen).
 *
 * Umbau-Notiz: Sobald Schritt 4 die Provider-Kette nach `src/app/providers.tsx`
 * zieht, sollte dieser Helper stattdessen jene Komponente verwenden — dann testet
 * das Netz die echte Provider-Konfiguration statt einer Nachbildung.
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
