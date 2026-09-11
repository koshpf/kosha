import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { applyTheme, usePortfolio } from "@/lib/store";
import { syncHistoryFromTotals } from "@/lib/use-portfolio-view";

function finishBoot() {
  const state = usePortfolio.getState();
  state.ensureSeeded();
  state.setHydrated();
  applyTheme(usePortfolio.getState().theme);
  if (usePortfolio.getState().history.length === 0) {
    syncHistoryFromTotals();
  }
}

function HydratePortfolio() {
  useEffect(() => {
    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      finishBoot();
    };

    const timer = window.setTimeout(complete, 4000);
    void Promise.resolve(usePortfolio.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(timer);
        complete();
      });

    return () => window.clearTimeout(timer);
  }, []);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 0, refetchOnWindowFocus: false, gcTime: 30 * 60_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <HydratePortfolio />
      {children}
      <Toaster
        position="bottom-right"
        theme="system"
        toastOptions={{
          className: "!bg-card !text-foreground !border-border",
        }}
      />
    </QueryClientProvider>
  );
}
