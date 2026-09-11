import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HoldingForm, TypePicker } from "@/components/holding-form";
import { ASSET_TYPE_MAP } from "@/lib/asset-types";
import type { AssetType } from "@/lib/types";

type NewHoldingSearch = {
  type?: AssetType;
};

function parseType(value: unknown): AssetType | undefined {
  return typeof value === "string" && value in ASSET_TYPE_MAP ? (value as AssetType) : undefined;
}

export const Route = createFileRoute("/holdings_/new")({
  validateSearch: (search: Record<string, unknown>): NewHoldingSearch => {
    const type = parseType(search.type);
    return type ? { type } : {};
  },
  component: NewHoldingPage,
});

function NewHoldingPage() {
  const { type } = Route.useSearch();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Portfolio
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight">Add holding</h1>
      </div>
      {type ? <HoldingForm key={type} initialType={type} /> : <TypePicker />}
    </AppShell>
  );
}
