"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sessionService } from "@/core/auth/session/session.service";

import { SettingsCard } from "./settings-card";

export function SignOutSection() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    sessionService.logout();
    router.replace("/login");
  }

  return (
    <SettingsCard id="session" title="Session" description="Sign out of Klugance on this device.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Using a shared or public computer? Always sign out when you&apos;re done.
        </p>
        <Button type="button" variant="outline" onClick={signOut} disabled={signingOut} className="shrink-0">
          <LogOut />
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </SettingsCard>
  );
}
