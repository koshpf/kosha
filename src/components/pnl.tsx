import { Hidden } from "@/components/hide-amounts";
import { formatPct, formatSignedInr, pnlTone } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PnlText({
  amount,
  pct,
  className,
}: {
  amount: number;
  pct?: number;
  className?: string;
}) {
  const tone = pnlTone(amount);
  return (
    <span
      className={cn(
        "tabular-nums",
        tone === "gain" && "text-gain",
        tone === "loss" && "text-loss",
        tone === "flat" && "text-muted-foreground",
        className,
      )}
    >
      <Hidden>
        {formatSignedInr(amount)}
        {pct != null ? ` (${formatPct(pct)})` : null}
      </Hidden>
    </span>
  );
}