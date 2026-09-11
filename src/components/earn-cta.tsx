import { Copy, ExternalLink, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OWNER_EARN, partnerForType, partnersFrom, upiPayHref } from "@/lib/earn";
import { formatBtc, formatGoldGrams, formatInr } from "@/lib/format";
import type { AssetType, PortfolioTotals } from "@/lib/types";

export function useEarn() {
  return OWNER_EARN;
}

export function PartnerCta({ type }: { type: AssetType }) {
  const earn = useEarn();
  const partner = partnerForType(type, earn);
  if (!partner) return null;
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-3 text-sm no-underline"
    >
      <span>
        Open {partner.label}
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Referral link · {partner.blurb}
        </span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

export function EarnStrip() {
  const earn = useEarn();
  const partners = partnersFrom(earn);
  if (partners.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {partners.map((row) => (
        <a
          key={row.id}
          href={row.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-between rounded-md bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)] no-underline"
        >
          <span>
            {row.label}
            <span className="mt-0.5 block text-xs text-muted-foreground">{row.blurb}</span>
          </span>
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}

const SUPPORT_AMOUNTS = [49, 99, 199];

export function SupportCard() {
  const earn = useEarn();
  const upiId = earn.upiId.trim();
  if (!upiId) return null;
  const name = earn.upiName || "Rahul Kumar";

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success("UPI ID copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-4" />
          Support Kosha
        </CardTitle>
        <CardDescription>
          If this tracker helps, send a thank-you on UPI. Optional — the app stays free.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm font-medium tabular-nums">{upiId}</p>
        <div className="flex flex-wrap gap-2">
          {SUPPORT_AMOUNTS.map((amount) => {
            const href = upiPayHref(upiId, amount, name);
            return href ? (
              <Button key={amount} asChild variant="outline" size="sm">
                <a href={href}>₹{amount}</a>
              </Button>
            ) : null;
          })}
          {upiPayHref(upiId, undefined, name) ? (
            <Button asChild size="sm">
              <a href={upiPayHref(upiId, undefined, name) ?? "#"}>Pay any amount</a>
            </Button>
          ) : null}
          <Button type="button" variant="ghost" size="sm" onClick={() => void copyUpi()}>
            <Copy />
            Copy UPI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export async function shareNetWorth(totals: PortfolioTotals) {
  const text = [
    "My net worth on Kosha",
    formatInr(totals.currentInr),
    `${formatGoldGrams(totals.goldGrams)} gold`,
    formatBtc(totals.btc),
    typeof window !== "undefined" ? window.location.origin : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Kosha", text });
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Copied. Paste it in WhatsApp or X.");
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied. Paste it in WhatsApp or X.");
    } catch {
      toast.error("Could not share.");
    }
  }
}

export function ShareNetWorthButton({ totals }: { totals: PortfolioTotals }) {
  return (
    <Button type="button" variant="outline" onClick={() => void shareNetWorth(totals)}>
      <Share2 />
      Share net worth
    </Button>
  );
}
