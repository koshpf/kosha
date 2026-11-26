import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HoldingForm, TypePicker } from "@/components/holding-form";
import { ASSET_TYPE_MAP } from "@/lib/asset-types";
import type { AssetType } from "@/lib/types";

type NewHoldingSearch = {
  type?: AssetType;
  coin?: "BTC" | "ETH" | "CRYPTO";
};

function parseType(value: unknown): AssetType | undefined {
  return typeof value === "string" && value in ASSET_TYPE_MAP ? (value as AssetType) : undefined;
}

function parseCoin(value: unknown): NewHoldingSearch["coin"] {
  return value === "BTC" || value === "ETH" || value === "CRYPTO" ? value : undefined;
}

export const Route = createFileRoute("/holdings_/new")({
  validateSearch: (search: Record<string, unknown>): NewHoldingSearch => {
    const type = parseType(search.type);
    const coin = parseCoin(search.coin);
    return { ...(type ? { type } : {}), ...(coin ? { coin } : {}) };
  },
  component: NewHoldingPage,
});

function NewHoldingPage() {
  const { type, coin } = Route.useSearch();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Portfolio
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight">Add holding</h1>
      </div>
      {type ? (
        <HoldingForm key={`${type}-${coin ?? ""}`} initialType={type} initialCoin={coin} />
      ) : (
        <TypePicker />
      )}
    </AppShell>
  );
}
