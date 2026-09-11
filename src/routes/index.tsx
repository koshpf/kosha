import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AssetCompare } from "@/components/asset-compare";
import { EarnStrip, SupportCard } from "@/components/earn-cta";
import { Hidden } from "@/components/hide-amounts";
import { SnapshotShare } from "@/components/snapshot-share";
import { UnitInsightCard } from "@/components/unit-insight";
import { NetWorthCards } from "@/components/net-worth-cards";
import { PnlText } from "@/components/pnl";
import { PriceTicker } from "@/components/price-ticker";
import { useRefreshPrices } from "@/components/price-sync";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { typeShortLabel } from "@/lib/asset-types";
import { formatInr, formatPct } from "@/lib/format";
import type { MemberVault } from "@/lib/member-vaults";
import { usePortfolio } from "@/lib/store";
import type { MarketQuotes } from "@/lib/types";
import { usePortfolioView } from "@/lib/use-portfolio-view";
import { aggregate, valueHolding } from "@/lib/valuation";

const AllocationChart = lazy(() =>
  import("@/components/allocation-chart").then((m) => ({ default: m.AllocationChart })),
);
const HistoryChart = lazy(() =>
  import("@/components/history-chart").then((m) => ({ default: m.HistoryChart })),
);

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { views, totals, market, history, hasHydrated } = usePortfolioView();
  const showUsd = usePortfolio((s) => s.showUsd);
  const vaults = usePortfolio((s) => s.vaults);
  const activeVaultId = usePortfolio((s) => s.activeVaultId);
  const activeVault = vaults.find((row) => row.id === activeVaultId) ?? vaults[0];
  const refresh = useRefreshPrices();
  const [busy, setBusy] = useState(false);

  async function onRefresh() {
    setBusy(true);
    try {
      const data = await refresh();
      toast.success(data.usedDemo ? "Using indicative prices" : "Prices updated");
    } catch {
      toast.error("Could not refresh. Showing last known prices.");
    } finally {
      setBusy(false);
    }
  }

  const top = [...views].sort((a, b) => b.currentValueInr - a.currentValueInr).slice(0, 5);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {activeVault ? `${activeVault.name} · net worth` : "Net worth"}
            </p>
            <h1 className="font-display text-3xl font-medium tracking-tight">Treasury</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-subtle">Unrealised P/L</p>
            <PnlText amount={totals.pnlInr} pct={totals.pnlPct} className="text-sm" />
          </div>
        </div>

        {!hasHydrated ? (
          <div className="grid gap-3 md:grid-cols-3">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : (
          <>
            <PriceTicker market={market} refreshing={busy} onRefresh={() => void onRefresh()} />
            <NetWorthCards totals={totals} market={market} showUsd={showUsd} />
            <AssetCompare market={market} />
            <UnitInsightCard history={history} />
            {vaults.length > 1 ? <FamilyTotals vaults={vaults} market={market} /> : null}
            <SnapshotShare totals={totals} history={history} vaultName={activeVault?.name} />
            <SupportCard />
            <EarnStrip />
            <p className="text-xs text-subtle">
              Gold and bitcoin are your rupee net worth converted at live prices — not extra holdings.
            </p>
            <div className="grid gap-3 lg:grid-cols-2">
              <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
                <AllocationChart views={views} />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
                <HistoryChart history={history} />
              </Suspense>
            </div>
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Largest holdings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/holdings">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col divide-y divide-border">
                {top.map((row) => (
                  <Link
                    key={row.holding.id}
                    to="/holdings/$holdingId"
                    params={{ holdingId: row.holding.id }}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.holding.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeShortLabel(row.holding.type)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm tabular-nums">
                        <Hidden>{formatInr(row.currentValueInr)}</Hidden>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Hidden>{formatPct(row.pnlPct)}</Hidden>
                      </p>
                    </div>
                  </Link>
                ))}
                {top.length === 0 ? (
                  <p className="py-6 text-sm text-muted-foreground">
                    No holdings yet.{" "}
                    <Link to="/holdings/new" className="underline">
                      Add one
                    </Link>
                    .
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

function FamilyTotals({
  vaults,
  market,
}: {
  vaults: MemberVault[];
  market: MarketQuotes;
}) {
  const rows = vaults.map((vault) => {
    const views = vault.holdings.map((holding) => valueHolding(holding, market));
    return { id: vault.id, name: vault.name, inr: aggregate(views, market).currentInr };
  });
  const family = rows.reduce((sum, row) => sum + row.inr, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between text-sm">
            <span>{row.name}</span>
            <span className="tabular-nums">
              <Hidden>{formatInr(row.inr)}</Hidden>
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm font-medium">
          <span>Together</span>
          <span className="tabular-nums">
            <Hidden>{formatInr(family)}</Hidden>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
