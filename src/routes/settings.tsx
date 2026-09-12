import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useRefreshPrices } from "@/components/price-sync";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { OWNER_EARN } from "@/lib/earn";
import { formatDateTime } from "@/lib/format";
import { MEMBER_ROLES, type MemberRole } from "@/lib/member-vaults";
import { applyTheme, usePortfolio } from "@/lib/store";
import { downloadBackup, parseVault, serializeBackup } from "@/lib/vault";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const theme = usePortfolio((s) => s.theme);
  const showUsd = usePortfolio((s) => s.showUsd);
  const setTheme = usePortfolio((s) => s.setTheme);
  const setShowUsd = usePortfolio((s) => s.setShowUsd);
  const lastPrices = usePortfolio((s) => s.lastPrices);
  const holdings = usePortfolio((s) => s.holdings);
  const snapshot = usePortfolio((s) => s.snapshot);
  const importVault = usePortfolio((s) => s.importVault);
  const resetLedger = usePortfolio((s) => s.resetLedger);
  const vaults = usePortfolio((s) => s.vaults);
  const activeVaultId = usePortfolio((s) => s.activeVaultId);
  const switchVault = usePortfolio((s) => s.switchVault);
  const addVault = usePortfolio((s) => s.addVault);
  const renameVault = usePortfolio((s) => s.renameVault);
  const removeVault = usePortfolio((s) => s.removeVault);
  const refresh = useRefreshPrices();
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newRole, setNewRole] = useState<MemberRole>("mother");
  const [newName, setNewName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onExport() {
    downloadBackup(serializeBackup(snapshot()));
    toast.success("Backup downloaded");
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(serializeBackup(snapshot()));
      toast.success("Backup copied. Save it in your notes or a password manager.");
    } catch {
      toast.error("Could not copy. Download the file instead.");
    }
  }

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = parseVault(String(reader.result ?? ""));
        importVault(payload);
        applyTheme(payload.theme);
        toast.success(`Restored ${payload.holdings.length} holdings`);
      } catch {
        toast.error("That file is not a Kosha backup.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Preferences
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight">Settings</h1>
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Your vault</CardTitle>
            <CardDescription>
              Holdings live on this phone or computer only — no account, nothing uploaded to us.
              Export a backup so you can reopen Kosha after a reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {holdings.length} holding{holdings.length === 1 ? "" : "s"} in this vault
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={onExport} className="sm:flex-1">
                Download backup
              </Button>
              <Button type="button" variant="outline" onClick={() => void onCopy()} className="sm:flex-1">
                Copy backup
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) onImportFile(file);
              }}
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              Restore from file
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family vaults</CardTitle>
            <CardDescription>
              Separate ledgers for yourself, parents, and children. Switch from the header. Backup
              exports every vault.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {vaults.map((vault) => (
                <li
                  key={vault.id}
                  className="flex flex-col gap-2 rounded-md bg-muted px-3 py-3 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <Input
                      value={vault.name}
                      aria-label={`${vault.name} vault name`}
                      onChange={(e) => renameVault(vault.id, e.target.value)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {vault.holdings.length} holding{vault.holdings.length === 1 ? "" : "s"}
                      {vault.id === activeVaultId ? " · open" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {vault.id !== activeVaultId ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => switchVault(vault.id)}>
                        Open
                      </Button>
                    ) : null}
                    {vaults.length > 1 ? (
                      confirmDeleteId === vault.id ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            removeVault(vault.id);
                            setConfirmDeleteId(null);
                            toast.success("Vault removed");
                          }}
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDeleteId(vault.id)}
                        >
                          Delete
                        </Button>
                      )
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="grid gap-2">
                <Label htmlFor="vault-role">Member</Label>
                <NativeSelect
                  id="vault-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as MemberRole)}
                >
                  {MEMBER_ROLES.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vault-name">Name (optional)</Label>
                <Input
                  id="vault-name"
                  value={newName}
                  placeholder="e.g. Ma"
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  addVault(newRole, newName);
                  setNewName("");
                  toast.success("Vault added. Add their holdings from Add.");
                }}
              >
                Add vault
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Kosha</CardTitle>
            <CardDescription>
              Tips go to the publisher. Visitors cannot change this.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">UPI · </span>
              <span className="font-medium tabular-nums">{OWNER_EARN.upiId}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Name · </span>
              {OWNER_EARN.upiName}
            </p>
            <p className="text-xs text-muted-foreground">Locked. Not editable.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Start over</CardTitle>
            <CardDescription>
              Demo holdings were loaded so the charts were not empty. Clear only the vault you have
              open.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {confirmReset ? (
              <>
                <p className="text-sm text-muted-foreground">
                  This removes every holding in the open vault. Other family vaults stay.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="destructive"
                    className="sm:flex-1"
                    onClick={() => {
                      resetLedger();
                      setConfirmReset(false);
                      toast.success("Ledger cleared. Add your holdings from Add.");
                    }}
                  >
                    Confirm clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => setConfirmReset(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <Button type="button" variant="outline" onClick={() => setConfirmReset(true)}>
                Clear all holdings
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Dark is the default. Light keeps the same ledger layout.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Light mode</p>
              <p className="text-xs text-muted-foreground">Off = dark treasury</p>
            </div>
            <Switch
              checked={theme === "light"}
              onCheckedChange={(checked) => {
                const next = checked ? "light" : "dark";
                setTheme(next);
                applyTheme(next);
              }}
              aria-label="Light mode"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency display</CardTitle>
            <CardDescription>Net worth is always in ₹. USD is a companion figure.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Show USD under rupees</p>
              <p className="text-xs text-muted-foreground">Uses the live USD/INR rate</p>
            </div>
            <Switch
              checked={showUsd}
              onCheckedChange={setShowUsd}
              aria-label="Show USD"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prices</CardTitle>
            <CardDescription>
              Indian stocks and funds in ₹, US names in $ and ₹, gold per gram, bitcoin in ₹ and $.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {lastPrices
                ? `Last refresh ${formatDateTime(lastPrices.asOf)}${lastPrices.usedDemo ? " · indicative" : ""}`
                : "Prices load on first visit"}
            </p>
            <Button
              onClick={async () => {
                setBusy(true);
                try {
                  const data = await refresh();
                  toast.success(data.usedDemo ? "Using indicative prices" : "Prices updated");
                } catch {
                  toast.error("Refresh failed");
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
            >
              Refresh prices
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to verify</CardTitle>
            <CardDescription>Three checks on your phone. No technical skill needed.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <ol className="flex list-decimal flex-col gap-3 pl-4 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">No login.</span> Kosha never asks for
                Gmail, OTP, or a password. If we stored your vault, we would need an account to show
                it back to you.
              </li>
              <li>
                <span className="font-medium text-foreground">Airplane mode.</span> Add a holding,
                turn on Airplane mode, open Kosha again. Your numbers are still there. Prices won’t
                refresh — that’s the internet. The ledger is on this phone.
              </li>
              <li>
                <span className="font-medium text-foreground">Backup file.</span> Tap Download backup
                above. Open the file in Files / Downloads. That JSON is your ledger. It never left
                the device unless you share the file.
              </li>
            </ol>
            <p className="text-xs text-subtle">
              Chrome will not ask for Contacts, SMS, Camera, or Location. Refresh only fetches public
              gold, stock, and bitcoin prices — not your quantities.
            </p>
            <a
              href="https://github.com/koshpf/kosha"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              Source on GitHub (optional)
            </a>
          </CardContent>
        </Card>

        <p className="px-1 text-xs text-subtle">
          This is local-first: your ledger stays on this phone or desktop browser. A backup file is
          the portable copy — not a login. Figures are for personal tracking, not investment advice.
        </p>
      </div>
    </AppShell>
  );
}
