import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, List, Plus, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { HideAmountsToggle } from "@/components/hide-amounts";
import { PriceSync } from "@/components/price-sync";
import { VaultSwitcher } from "@/components/vault-switcher";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/holdings", label: "Holdings", icon: List },
  { to: "/holdings/new", label: "Add", icon: Plus },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PriceSync />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-border bg-background pt-8 pb-6 md:flex md:flex-col">
        <Link to="/" className="px-6">
          <span className="font-display text-2xl italic tracking-tight">Kosha</span>
          <span className="mt-1 block text-xs text-muted-foreground">Treasury</span>
        </Link>
        <div className="mt-4 flex items-center gap-1 px-3">
          <div className="min-w-0 flex-1">
            <VaultSwitcher />
          </div>
          <HideAmountsToggle />
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : item.to === "/holdings"
                  ? pathname === "/holdings"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-6 text-xs text-subtle">Indicative prices. Not advice.</p>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4 md:hidden">
        <Link to="/" className="font-display text-xl italic tracking-tight">
          Kosha
        </Link>
        <div className="flex items-center gap-1">
          <VaultSwitcher />
          <HideAmountsToggle />
        </div>
      </header>

      <main className="md:pl-56">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-10">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-4">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : item.to === "/holdings"
                  ? pathname === "/holdings"
                  : pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 touch-manipulation flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
