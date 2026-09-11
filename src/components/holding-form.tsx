import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { TickerSearch } from "@/components/ticker-search";
import { PartnerCta } from "@/components/earn-cta";
import { LiveNavBox } from "@/components/live-nav-box";
import { ASSET_TYPES, ASSET_TYPE_MAP } from "@/lib/asset-types";
import { FALLBACK_MARKET } from "@/lib/fallback-prices";
import { formatBtcNumber, formatGoldGrams, formatInr, parseAmount } from "@/lib/format";
import { FX_CURRENCIES, fxName, inrPerFx, isFxCode, type FxCode } from "@/lib/fx";
import { OTHER_ASSETS, otherAssetById, otherAssetFromHolding } from "@/lib/other-assets";
import { ULIP_FUNDS, ULIP_INSURERS, ulipByCode } from "@/lib/ulip-index";
import { usePortfolio } from "@/lib/store";
import type { AssetType, Exchange, GoldPurity, Holding, HoldingCurrency } from "@/lib/types";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  type: AssetType;
  ticker: string;
  exchange: Exchange;
  quantity: string;
  avgPrice: string;
  costBasisInr: string;
  purity: GoldPurity;
  manualValueInr: string;
  notes: string;
  fxCode: FxCode;
};

function emptyForm(type: AssetType = "indian_stock"): FormState {
  return {
    name: defaultName(type),
    type,
    ticker: "",
    exchange: type === "us_stock" ? "US" : "NSE",
    quantity: "",
    avgPrice: "",
    costBasisInr: "",
    purity: 22,
    manualValueInr: "",
    notes: "",
    fxCode: "USD",
  };
}

function fromHolding(holding: Holding): FormState {
  return {
    name: holding.name,
    type: holding.type,
    ticker:
      holding.type === "other"
        ? (otherAssetFromHolding(holding.name, holding.ticker)?.id ?? "CUSTOM")
        : (holding.ticker ?? ""),
    exchange: holding.exchange ?? (holding.type === "us_stock" ? "US" : "NSE"),
    quantity: String(holding.quantity || ""),
    avgPrice: String(holding.avgPrice || ""),
    costBasisInr: String(holding.costBasisInr || ""),
    purity: holding.purity ?? 22,
    manualValueInr: holding.manualValueInr != null ? String(holding.manualValueInr) : "",
    notes: holding.notes ?? "",
    fxCode: isFxCode(holding.currency) ? holding.currency : "USD",
  };
}

const CASH_LIKE: AssetType[] = ["bank", "rd", "fd", "other"];

function isCashLike(type: AssetType) {
  return CASH_LIKE.includes(type);
}

function isSimpleAmount(type: AssetType) {
  return type === "usd_cash" || isCashLike(type);
}

function needsTicker(type: AssetType) {
  return type === "indian_stock" || type === "us_stock" || type === "etf" || type === "indian_mf";
}

function defaultName(type: AssetType) {
  if (type === "usd_cash") return fxName("USD");
  return "";
}

export function TypePicker() {
  const navigate = useNavigate();
  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      <form
        method="get"
        action="/holdings/new"
        className="mb-6"
        onSubmit={(e) => {
          const select = (e.currentTarget.elements.namedItem("type") as HTMLSelectElement | null)
            ?.value;
          if (select) {
            e.preventDefault();
            void navigate({ to: "/holdings/new", search: { type: select as AssetType } });
          }
        }}
      >
        <Label htmlFor="holding-type">Type</Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <NativeSelect
            id="holding-type"
            name="type"
            required
            defaultValue=""
            className="touch-manipulation"
            onChange={(e) => {
              const next = e.target.value;
              if (next) void navigate({ to: "/holdings/new", search: { type: next as AssetType } });
            }}
          >
            <option value="" disabled>
              Choose type
            </option>
            {ASSET_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
          <Button type="submit" className="touch-manipulation sm:w-auto">
            Continue
          </Button>
        </div>
      </form>

      <p className="mb-3 text-sm font-medium">Or tap a type</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ASSET_TYPES.map((item) => (
          <Link
            key={item.id}
            to="/holdings/new"
            search={{ type: item.id }}
            className="flex min-h-16 touch-manipulation cursor-pointer flex-col justify-center rounded-md bg-muted px-3 py-3 text-left text-sm text-foreground no-underline active:bg-border"
          >
            <span className="block font-medium">{item.shortLabel}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{item.hint}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HoldingForm({
  existing,
  initialType,
}: {
  existing?: Holding;
  initialType?: AssetType;
}) {
  const navigate = useNavigate();
  const addHolding = usePortfolio((s) => s.addHolding);
  const updateHolding = usePortfolio((s) => s.updateHolding);
  const hasHydrated = usePortfolio((s) => s.hasHydrated);
  const [form, setForm] = useState<FormState>(
    existing ? fromHolding(existing) : emptyForm(initialType ?? "indian_stock"),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [manualEntry, setManualEntry] = useState(
    Boolean(existing && needsTicker(existing.type) && !existing.ticker),
  );
  const nameTouched = useRef(Boolean(existing?.name));

  const patch = (partial: Partial<FormState>) => setForm((prev) => ({ ...prev, ...partial }));

  const qtyLabel = useMemo(() => {
    switch (form.type) {
      case "physical_gold":
        return "Grams";
      case "usd_cash":
        return "Amount (USD)";
      case "indian_mf":
      case "ulip":
        return "Units";
      case "bank":
        return "Balance (₹)";
      default:
        return "Quantity / units";
    }
  }, [form.type]);

  const priceLabel = useMemo(() => {
    switch (form.type) {
      case "indian_mf":
      case "ulip":
        return "Average NAV";
      case "physical_gold":
        return "Buy price per gram (₹)";
      case "us_stock":
        return "Average buy price (USD)";
      case "usd_cash":
        return "INR spent per USD (optional)";
      default:
        return "Average buy price (₹)";
    }
  }, [form.type]);

  function submit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    if (!hasHydrated) {
      setError("Still loading your vault. Try again in a moment.");
      return;
    }
    const catalogName =
      form.type === "ulip" && form.ticker !== "custom"
        ? ulipByCode(form.ticker)?.name
        : form.type === "other" && form.ticker !== "CUSTOM"
          ? otherAssetById(form.ticker)?.label
          : undefined;
    const name = form.name.trim() || catalogName || defaultName(form.type);
    if (!name) {
      setError("Name is required.");
      return;
    }
    if (form.type === "other" && !form.ticker.trim()) {
      setError("Pick what this holding is.");
      return;
    }
    if (form.type === "ulip" && form.ticker !== "custom" && !form.ticker.trim()) {
      setError("Pick a ULIP fund.");
      return;
    }
    if (needsTicker(form.type) && !manualEntry && !form.ticker.trim()) {
      setError(form.type === "indian_mf" ? "Enter a scheme code or pick a fund." : "Ticker is required.");
      return;
    }

    const quantity = parseAmount(form.quantity);
    const avgPrice = parseAmount(form.avgPrice || "0");
    const manual = form.manualValueInr.trim() ? parseAmount(form.manualValueInr) : undefined;
    if (form.avgPrice && Number.isNaN(avgPrice)) {
      setError("Enter a valid buy price.");
      return;
    }
    if (manual != null && Number.isNaN(manual)) {
      setError("Enter a valid current value.");
      return;
    }

    const currency: HoldingCurrency =
      form.type === "usd_cash" ? form.fxCode : form.type === "us_stock" ? "USD" : "INR";
    const market = usePortfolio.getState().lastPrices ?? FALLBACK_MARKET;
    const usdInr = market.usdInr;

    let qty = quantity;
    let price = avgPrice;
    let costBasisInr = form.costBasisInr.trim() ? parseAmount(form.costBasisInr) : NaN;
    let manualValueInr = manual;

    if (form.type === "usd_cash") {
      if (Number.isNaN(quantity) || quantity <= 0) {
        setError("Enter the amount.");
        return;
      }
      qty = quantity;
      price = inrPerFx(market, form.fxCode);
      if (!Number.isFinite(costBasisInr) || costBasisInr < 0) costBasisInr = qty * price;
      manualValueInr = undefined;
    } else if (isCashLike(form.type)) {
      const amount = parseAmount(form.quantity || form.costBasisInr || form.manualValueInr);
      if (Number.isNaN(amount) || amount <= 0) {
        setError("Enter an amount in ₹.");
        return;
      }
      qty = form.type === "bank" ? amount : 1;
      price = form.type === "bank" ? 1 : amount;
      costBasisInr = amount;
      manualValueInr = amount;
    } else {
      if (Number.isNaN(quantity) || quantity <= 0) {
        setError("Enter a valid quantity.");
        return;
      }
      if (!Number.isFinite(costBasisInr) || costBasisInr < 0) {
        if (form.type === "us_stock") costBasisInr = qty * price * usdInr;
        else costBasisInr = qty * price;
      }
      if (manualEntry && (manualValueInr == null || Number.isNaN(manualValueInr))) {
        manualValueInr = costBasisInr;
      }
    }

    const now = Date.now();
    const payload: Holding = {
      id: existing?.id ?? `hld_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      name:
        form.type === "usd_cash"
          ? fxName(form.fxCode)
          : form.type === "ulip" && form.ticker !== "custom"
            ? (ulipByCode(form.ticker)?.name ?? name)
            : form.type === "other" && form.ticker !== "CUSTOM"
              ? (otherAssetById(form.ticker)?.label ?? name)
              : name,
      type: form.type,
      ticker:
        form.type === "ulip" && form.ticker === "custom"
          ? undefined
          : form.type === "other" && (form.ticker === "CUSTOM" || !form.ticker)
            ? undefined
            : form.ticker.trim() || undefined,
      exchange:
        form.type === "indian_stock" || form.type === "etf"
          ? form.exchange
          : form.type === "us_stock"
            ? "US"
            : undefined,
      quantity: qty,
      avgPrice: price,
      currency,
      costBasisInr,
      purity: form.type === "physical_gold" ? form.purity : undefined,
      manualValueInr:
        form.type === "usd_cash"
          ? undefined
          : form.type === "physical_gold" ||
              isCashLike(form.type) ||
              (needsTicker(form.type) && manualEntry)
            ? manualValueInr
            : undefined,
      notes: form.notes.trim() || undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    setSaving(true);
    try {
      if (existing) updateHolding(existing.id, payload);
      else addHolding(payload);
      toast.success(existing ? "Holding updated" : "Holding added");
      void navigate({ to: "/holdings" });
    } catch {
      setError("Could not save. Try again.");
      setSaving(false);
    }
  }

  const selectedMeta = ASSET_TYPE_MAP[form.type];
  const market = usePortfolio((s) => s.lastPrices) ?? FALLBACK_MARKET;
  const fxAmount = parseAmount(form.quantity);
  const fxInr =
    form.type === "usd_cash" && Number.isFinite(fxAmount) && fxAmount > 0
      ? fxAmount * inrPerFx(market, form.fxCode)
      : 0;
  const showLiveNav =
    !manualEntry &&
    (needsTicker(form.type) || form.type === "ulip" || form.type === "physical_gold");

  if (!hasHydrated) {
    return <p className="text-sm text-muted-foreground">Loading your vault…</p>;
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mx-auto flex max-w-2xl flex-col gap-6 pb-28 md:pb-0"
    >
      <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="text-sm font-medium">{selectedMeta.label}</p>
        </div>
        {existing ? null : (
          <a
            href="/holdings/new"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "touch-manipulation no-underline")}
          >
            Change
          </a>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {needsTicker(form.type) && !manualEntry ? (
          <Field
            label={form.type === "indian_mf" ? "Scheme name or AMFI code" : "Ticker"}
            className="relative z-20 overflow-visible sm:col-span-2"
          >
            <TickerSearch
              type={form.type}
              value={form.ticker}
              autoFocus={!existing}
              onChange={(ticker) => patch({ ticker })}
              onPick={(hit) => {
                nameTouched.current = true;
                patch({
                  ticker: hit.ticker,
                  name: hit.name,
                  exchange: hit.exchange ?? form.exchange,
                });
              }}
              onAutoName={(name) => {
                if (nameTouched.current) return;
                setForm((prev) => (prev.name === name ? prev : { ...prev, name }));
              }}
            />
            <button
              type="button"
              className="mt-1 text-left text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => setManualEntry(true)}
            >
              No ticker? Enter name and amount instead
            </button>
          </Field>
        ) : null}

        {needsTicker(form.type) && manualEntry ? (
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Manual entry — live price will not be fetched.{" "}
            <button
              type="button"
              className="underline-offset-2 hover:underline"
              onClick={() => setManualEntry(false)}
            >
              Search by ticker
            </button>
          </p>
        ) : null}

        {form.type === "indian_stock" || form.type === "etf" ? (
          <Field label="Exchange">
            <NativeSelect
              value={form.exchange}
              onChange={(e) => patch({ exchange: e.target.value as Exchange })}
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              {form.type === "etf" ? <option value="US">US</option> : null}
            </NativeSelect>
          </Field>
        ) : null}

        {form.type === "ulip" ? (
          <>
            <Field label="Fund" className="sm:col-span-2">
              <NativeSelect
                value={form.ticker}
                autoFocus={!existing}
                onChange={(e) => {
                  const code = e.target.value;
                  const fund = ulipByCode(code);
                  nameTouched.current = true;
                  patch({ ticker: code, name: fund?.name ?? (code === "custom" ? "" : form.name) });
                }}
              >
                <option value="">Choose ULIP fund</option>
                {ULIP_INSURERS.map((insurer) => (
                  <optgroup key={insurer} label={insurer}>
                    {ULIP_FUNDS.filter((row) => row.insurer === insurer).map((row) => (
                      <option key={row.code} value={row.code}>
                        {row.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="custom">Other — enter name yourself</option>
              </NativeSelect>
            </Field>
            {form.ticker === "custom" ? (
              <Field label="Name" className="sm:col-span-2">
                <Input
                  value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="Policy / fund name"
                />
              </Field>
            ) : null}
          </>
        ) : form.type === "other" ? (
          <>
            <Field label="What is this?" className="sm:col-span-2">
              <NativeSelect
                value={form.ticker}
                autoFocus={!existing}
                onChange={(e) => {
                  const id = e.target.value;
                  const row = otherAssetById(id);
                  nameTouched.current = true;
                  patch({
                    ticker: id,
                    name: id === "CUSTOM" ? "" : (row?.label ?? ""),
                  });
                }}
              >
                <option value="">Choose</option>
                {OTHER_ASSETS.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            {form.ticker === "CUSTOM" ? (
              <Field label="Name" className="sm:col-span-2">
                <Input
                  value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Brother's loan, antique, startup equity"
                />
              </Field>
            ) : null}
          </>
        ) : form.type === "usd_cash" ? (
          <>
            <Field label="Currency" className="sm:col-span-2">
              <NativeSelect
                value={form.fxCode}
                autoFocus={!existing}
                onChange={(e) => {
                  const code = e.target.value as FxCode;
                  nameTouched.current = true;
                  patch({ fxCode: code, name: fxName(code) });
                }}
              >
                {FX_CURRENCIES.map((row) => (
                  <option key={row.code} value={row.code}>
                    {row.code} — {row.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label={`Amount (${form.fxCode})`} className="sm:col-span-2">
              <Input
                inputMode="decimal"
                value={form.quantity}
                onChange={(e) => patch({ quantity: e.target.value })}
                placeholder="3000"
              />
            </Field>
            {fxInr > 0 ? (
              <div className="sm:col-span-2 rounded-md bg-muted px-3 py-3 text-sm">
                <p className="text-xs text-muted-foreground">This holding is worth</p>
                <p className="mt-1 font-medium tabular-nums">{formatInr(fxInr)}</p>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {formatGoldGrams(market.goldInrPerGram24k > 0 ? fxInr / market.goldInrPerGram24k : 0)}{" "}
                  gold · {formatBtcNumber(market.btcInr > 0 ? fxInr / market.btcInr : 0)} BTC
                </p>
              </div>
            ) : (
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Pick a currency, type the amount, and Kosha converts it to ₹, gold, and bitcoin.
              </p>
            )}
          </>
        ) : (
          <Field label="Name" className="sm:col-span-2">
            <Input
              value={form.name}
              onChange={(e) => {
                nameTouched.current = e.target.value.trim().length > 0;
                patch({ name: e.target.value });
              }}
              placeholder={form.type === "bank" ? "HDFC savings" : "e.g. Reliance Industries"}
            />
          </Field>
        )}

        {form.type === "physical_gold" ? (
          <Field label="Purity">
            <NativeSelect
              value={String(form.purity)}
              onChange={(e) => patch({ purity: Number(e.target.value) as GoldPurity })}
            >
              <option value="22">22K</option>
              <option value="24">24K</option>
            </NativeSelect>
          </Field>
        ) : null}

        {form.type !== "usd_cash" && isSimpleAmount(form.type) ? (
          <Field label="Amount (₹)" className="sm:col-span-2">
            <Input
              inputMode="decimal"
              value={form.quantity}
              onChange={(e) => patch({ quantity: e.target.value })}
              placeholder="0"
            />
          </Field>
        ) : form.type !== "usd_cash" && !isSimpleAmount(form.type) ? (
          <>
            <Field label={qtyLabel}>
              <Input
                inputMode="decimal"
                value={form.quantity}
                onChange={(e) => patch({ quantity: e.target.value })}
                placeholder="0"
                required
              />
            </Field>
            <Field label={priceLabel}>
              <Input
                inputMode="decimal"
                value={form.avgPrice}
                onChange={(e) => patch({ avgPrice: e.target.value })}
                placeholder="0"
              />
            </Field>
            {showLiveNav ? (
              <LiveNavBox
                type={form.type}
                ticker={form.ticker}
                exchange={form.exchange}
                quantity={form.quantity}
                avgPrice={form.avgPrice}
                purity={form.purity}
              />
            ) : null}
            {manualEntry ? (
              <Field label="Current value (₹, optional)">
                <Input
                  inputMode="decimal"
                  value={form.manualValueInr}
                  onChange={(e) => patch({ manualValueInr: e.target.value })}
                  placeholder="Leave blank to use quantity × price"
                />
              </Field>
            ) : (
              <Field label="Cost basis (₹, optional)">
                <Input
                  inputMode="decimal"
                  value={form.costBasisInr}
                  onChange={(e) => patch({ costBasisInr: e.target.value })}
                  placeholder="Calculated from quantity × price"
                />
              </Field>
            )}
          </>
        ) : null}

        {form.type === "physical_gold" ? (
          <Field label="Manual current value (₹, optional)">
            <Input
              inputMode="decimal"
              value={form.manualValueInr}
              onChange={(e) => patch({ manualValueInr: e.target.value })}
              placeholder="Leave blank for live gold price"
            />
          </Field>
        ) : null}

        <Field label="Notes" className="sm:col-span-2">
          <Textarea
            value={form.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Optional"
          />
        </Field>
        <div className="sm:col-span-2">
          <PartnerCta type={form.type} />
        </div>
      </div>

      {error ? <p className="text-sm text-loss">{error}</p> : null}

      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border bg-background p-3 md:static md:z-auto md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-2xl flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/holdings" })}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="min-h-12">
            {saving ? "Saving…" : existing ? "Save changes" : "Add holding"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
