import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useHideAmounts } from "@/components/hide-amounts";
import { renderTreasuryCard } from "@/lib/snapshot-card";
import type { HistoryPoint, PortfolioTotals } from "@/lib/types";
import { unitInsight } from "@/lib/unit-insight";

async function makeCard(
  totals: PortfolioTotals,
  history: HistoryPoint[],
  vaultName: string | undefined,
  hideAmounts: boolean,
) {
  return renderTreasuryCard({
    totals,
    insight: unitInsight(history),
    vaultName,
    hideAmounts,
  });
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function SnapshotShare({
  totals,
  history,
  vaultName,
}: {
  totals: PortfolioTotals;
  history: HistoryPoint[];
  vaultName?: string;
}) {
  const hideAmounts = useHideAmounts();

  async function onShare() {
    try {
      const blob = await makeCard(totals, history, vaultName, hideAmounts);
      const file = new File([blob], "kosha-treasury.png", { type: "image/png" });
      const text = "Indian net worth in ₹, gold grams, and BTC. Kosha (beta)\nhttps://koshapftracker.vercel.app";
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "Kosha", text });
        return;
      }
      if (nav.share) {
        downloadBlob(blob, "kosha-treasury.png");
        await nav.share({ title: "Kosha", text });
        return;
      }
      downloadBlob(blob, "kosha-treasury.png");
      await navigator.clipboard.writeText(text);
      toast.success("Card saved. Caption copied.");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      toast.error("Could not share card.");
    }
  }

  async function onSave() {
    try {
      const blob = await makeCard(totals, history, vaultName, hideAmounts);
      downloadBlob(blob, "kosha-treasury.png");
      toast.success("Card saved");
    } catch {
      toast.error("Could not save card.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={() => void onShare()}>
        <Share2 />
        Share card
      </Button>
      <Button type="button" variant="ghost" onClick={() => void onSave()}>
        <Download />
        Save PNG
      </Button>
    </div>
  );
}
