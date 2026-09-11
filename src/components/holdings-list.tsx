import { Link } from "@tanstack/react-router";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PnlText } from "@/components/pnl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ASSET_TYPES, typeShortLabel } from "@/lib/asset-types";
import { formatDateTime, formatInr, formatQty, relativeTime } from "@/lib/format";
import type { AssetType, HoldingView } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "value" | "pnl" | "name" | "type";

export function HoldingsList({
  views,
  onDelete,
}: {
  views: HoldingView[];
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<AssetType | "all">("all");
  const [sort, setSort] = useState<SortKey>("value");
  const [pendingDelete, setPendingDelete] = useState<HoldingView | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = views.filter((row) => {
      if (type !== "all" && row.holding.type !== type) return false;
      if (!q) return true;
      const hay = `${row.holding.name} ${row.holding.ticker ?? ""} ${typeShortLabel(row.holding.type)}`.toLowerCase();
      return hay.includes(q);
    });
    filtered.sort((a, b) => {
      if (sort === "name") return a.holding.name.localeCompare(b.holding.name);
      if (sort === "type") return a.holding.type.localeCompare(b.holding.type);
      if (sort === "pnl") return b.pnlInr - a.pnlInr;
      return b.currentValueInr - a.currentValueInr;
    });
    return filtered;
  }, [views, query, type, sort]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ticker"
            className="pl-9"
          />
        </div>
        <NativeSort value={sort} onChange={setSort} />
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-2">
          <FilterChip active={type === "all"} onClick={() => setType("all")}>
            {`All · ${views.length}`}
          </FilterChip>
          {ASSET_TYPES.map((item) => {
            const count = views.filter((row) => row.holding.type === item.id).length;
            if (count === 0 && type !== item.id) return null;
            return (
              <FilterChip
                key={item.id}
                active={type === item.id}
                onClick={() => setType(item.id)}
              >
                {count > 0 ? `${item.shortLabel} · ${count}` : item.shortLabel}
              </FilterChip>
            );
          })}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] md:block">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium">Holding</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">P/L</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.holding.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{row.holding.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeShortLabel(row.holding.type)}
                    {row.holding.type === "usd_cash"
                      ? ` · ${row.holding.currency}`
                      : row.holding.ticker
                        ? ` · ${row.holding.ticker}`
                        : ""}
                    {row.quoted && row.pricePerUnit != null && (row.holding.type === "indian_mf" || row.holding.type === "ulip")
                      ? ` · NAV ₹${row.pricePerUnit.toLocaleString("en-IN", { maximumFractionDigits: 4 })}`
                      : ""}
                  </p>
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatQty(row.holding.quantity)}
                  {row.holding.type === "usd_cash" ? ` ${row.holding.currency}` : ""}
                </td>
                <td className="px-4 py-3 tabular-nums">{formatInr(row.costBasisInr)}</td>
                <td className="px-4 py-3 tabular-nums font-medium">
                  {formatInr(row.currentValueInr)}
                </td>
                <td className="px-4 py-3">
                  <PnlText amount={row.pnlInr} pct={row.pnlPct} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground" title={formatDateTime(row.lastUpdated)}>
                  {relativeTime(row.lastUpdated)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link to="/holdings/$holdingId" params={{ holdingId: row.holding.id }} aria-label="Edit">
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPendingDelete(row)}
                      aria-label="Delete"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No holdings match.</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <article key={row.holding.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.holding.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {typeShortLabel(row.holding.type)}
                  {row.holding.ticker ? ` · ${row.holding.ticker}` : ""}
                  {row.holding.type === "usd_cash" ? ` ${row.holding.currency}` : ""}
                  {" · "}
                  {formatQty(row.holding.quantity)}
                  {row.holding.type === "usd_cash" ? ` ${row.holding.currency}` : ""}
                </p>
                {row.holding.type === "indian_mf" || row.holding.type === "ulip" ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {row.quoted && row.pricePerUnit != null
                      ? `NAV ₹${row.pricePerUnit.toLocaleString("en-IN", { maximumFractionDigits: 4 })}`
                      : "Waiting for live NAV"}
                  </p>
                ) : null}
              </div>
              <Badge variant="outline">{formatInr(row.currentValueInr)}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <PnlText amount={row.pnlInr} pct={row.pnlPct} />
              <span className="text-xs text-subtle">{relativeTime(row.lastUpdated)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/holdings/$holdingId" params={{ holdingId: row.holding.id }}>
                  Edit
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(row)}>
                Delete
              </Button>
            </div>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No holdings match.</p>
        ) : null}
      </div>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogTitle>Delete holding</DialogTitle>
          <DialogDescription>
            Remove {pendingDelete?.holding.name}? This stays on this device only.
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete) onDelete(pendingDelete.holding.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3 text-xs font-medium transition-colors duration-150",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function NativeSort({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="h-11 rounded-md border border-border bg-background px-3 text-sm"
    >
      <option value="value">Sort by value</option>
      <option value="pnl">Sort by P/L</option>
      <option value="name">Sort by name</option>
      <option value="type">Sort by type</option>
    </select>
  );
}
