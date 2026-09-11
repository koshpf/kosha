import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HoldingForm } from "@/components/holding-form";
import { usePortfolio } from "@/lib/store";

export const Route = createFileRoute("/holdings_/$holdingId")({ component: EditHoldingPage });

function EditHoldingPage() {
  const { holdingId } = Route.useParams();
  const holding = usePortfolio((s) => s.holdings.find((row) => row.id === holdingId));
  const hasHydrated = usePortfolio((s) => s.hasHydrated);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Portfolio
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight">Edit holding</h1>
      </div>
      {!hasHydrated ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : holding ? (
        <HoldingForm existing={holding} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Holding not found.{" "}
          <Link to="/holdings" className="underline">
            Back to list
          </Link>
        </p>
      )}
    </AppShell>
  );
}
