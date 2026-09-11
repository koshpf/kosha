import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/lib/store";
import { cn } from "@/lib/utils";

export const AMOUNT_MASK = "••••";

export function useHideAmounts() {
  return usePortfolio((s) => s.hideAmounts);
}

export function Hidden({ children, className }: { children: ReactNode; className?: string }) {
  const hide = useHideAmounts();
  if (!hide) return <>{children}</>;
  return (
    <span className={cn("tabular-nums tracking-widest", className)} aria-label="Hidden">
      {AMOUNT_MASK}
    </span>
  );
}

export function HideAmountsToggle({ className }: { className?: string }) {
  const hide = useHideAmounts();
  const setHideAmounts = usePortfolio((s) => s.setHideAmounts);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-pressed={hide}
      aria-label={hide ? "Show amounts" : "Hide amounts"}
      title={hide ? "Show amounts" : "Hide amounts"}
      onClick={() => setHideAmounts(!hide)}
    >
      {hide ? <EyeOff /> : <Eye />}
    </Button>
  );
}
