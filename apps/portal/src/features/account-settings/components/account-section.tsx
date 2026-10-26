"use client";

import Link from "next/link";
import { ArrowRight, AtSign, Fingerprint, Phone, ShieldCheck, type LucideIcon } from "lucide-react";

import { useAuthStore } from "@/core/auth/store/auth.store";
import { getPortalRole } from "@/core/auth/utils/portal-role";
import { cn } from "@/lib/utils";

import { SettingsCard } from "./settings-card";

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  LOCKED: "Locked",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};

/** Sign-in identity and account state — not the personal profile. */
export function AccountSection() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const role = getPortalRole(user);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U";
  const active = user.status === "ACTIVE";

  return (
    <SettingsCard id="account" title="Account" description="How you sign in to Klugance and the state of your account.">
      <dl className="divide-y rounded-xl border">
        <Row icon={AtSign} label="Sign-in email" value={user.email} />
        <Row icon={Phone} label="Registered mobile" value={user.mobile_number || "—"} />
        <Row icon={Fingerprint} label="Account ID" value={<span className="font-mono text-xs">{user.id}</span>} />
        <Row
          icon={ShieldCheck}
          label="Account status"
          value={
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                active ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground",
              )}
            >
              <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-muted-foreground")} />
              {statusLabels[user.status] ?? user.status}
            </span>
          }
        />
      </dl>

      {role && (
        <Link
          href={`/${role.toLowerCase()}/profile`}
          className="group mt-4 flex items-center gap-3 rounded-xl bg-muted/40 p-3 transition-colors hover:bg-muted"
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-xs font-semibold">
            {user.profile_picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile_picture} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{fullName}</span>
            <span className="block text-xs text-muted-foreground">Photo and personal details live in your profile</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View profile
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}
    </SettingsCard>
  );
}

function Row({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </dt>
      <dd className="min-w-0 truncate text-sm font-medium sm:text-right">{value}</dd>
    </div>
  );
}
