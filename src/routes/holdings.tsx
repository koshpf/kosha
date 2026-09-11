import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HoldingsList } from "@/components/holdings-list";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/lib/store";
import { usePortfolioView } from "@/lib/use-portfolio-view";

export const Route = createFileRoute("/holdings")({ component: HoldingsPage });

function HoldingsPage() {
  const { views, hasHydrated } = usePortfolioView();
  const removeHolding = usePortfolio((s) => s.removeHolding);
  const vaults = usePortfolio((s) => s.vaults);
  const activeVaultId = usePortfolio((s) => s.activeVaultId);
  const activeVault = vaults.find((row) => row.id === activeVaultId);

  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {activeVault?.name ?? "Portfolio"}
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight">Holdings</h1>
          {hasHydrated ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {views.length} holding{views.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <Button asChild>
          <Link to="/holdings/new">Add holding</Link>
        </Button>
      </div>
      {hasHydrated ? (
        <HoldingsList views={views} onDelete={removeHolding} />
      ) : (
        <p className="text-sm text-muted-foreground">Loading holdings…</p>
      )}
    </AppShell>
  );
}
