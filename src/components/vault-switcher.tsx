import { Link } from "@tanstack/react-router";
import { NativeSelect } from "@/components/ui/native-select";
import { roleLabel } from "@/lib/member-vaults";
import { usePortfolio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function VaultSwitcher({ className }: { className?: string }) {
  const vaults = usePortfolio((s) => s.vaults);
  const activeVaultId = usePortfolio((s) => s.activeVaultId);
  const switchVault = usePortfolio((s) => s.switchVault);
  const active = vaults.find((row) => row.id === activeVaultId) ?? vaults[0];

  if (!active) return null;

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <NativeSelect
        aria-label="Family vault"
        value={active.id}
        onChange={(e) => switchVault(e.target.value)}
        className="h-9 min-w-0 max-w-[11rem] truncate text-sm md:max-w-[13rem]"
      >
        {vaults.map((row) => (
          <option key={row.id} value={row.id}>
            {row.name}
            {row.name !== roleLabel(row.role) ? ` · ${roleLabel(row.role)}` : ""}
          </option>
        ))}
      </NativeSelect>
      <Link
        to="/settings"
        className="hidden shrink-0 text-xs text-muted-foreground underline-offset-4 hover:underline md:inline"
      >
        Vaults
      </Link>
    </div>
  );
}
