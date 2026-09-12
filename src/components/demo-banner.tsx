import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isSampleHoldingId } from "@/lib/sample-holdings";
import { usePortfolio } from "@/lib/store";

export function DemoBanner() {
  const holdings = usePortfolio((s) => s.holdings);
  const clearSampleHoldings = usePortfolio((s) => s.clearSampleHoldings);
  const samples = holdings.filter((row) => isSampleHoldingId(row.id)).length;
  if (samples === 0) return null;
  const onlyDemo = samples === holdings.length;

  return (
    <div className="rounded-xl border border-border bg-muted px-4 py-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Demo treasury</p>
      <p className="mt-1 font-display text-lg font-medium tracking-tight">
        This is sample data, not someone else’s vault.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Reliance, Infosys, and the rest are fake rows so charts aren’t empty. Your money is not here.
        Kosha stores holdings only in this browser — we have no login and no copy of your ledger.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => {
            clearSampleHoldings();
            toast.success(onlyDemo ? "Demo cleared. Add your holdings." : "Demo rows removed.");
          }}
        >
          {onlyDemo ? "Start with an empty vault" : "Remove demo holdings"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to="/holdings/new">Add my holding</Link>
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link to="/settings">How to verify</Link>
        </Button>
      </div>
    </div>
  );
}
