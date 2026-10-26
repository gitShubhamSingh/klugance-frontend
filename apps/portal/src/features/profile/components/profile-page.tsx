"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Hash,
  KeyRound,
  Mail,
  Phone,
  School,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { roleAccent } from "@/components/layout/header/header-data";
import type { PortalRole } from "@/components/layout/roles/portal-config";
import { useAuthStore } from "@/core/auth/store/auth.store";
import { SettingsCard } from "@/features/account-settings/components/settings-card";

import { ProfileHero } from "./profile-hero";
import { TeachingCard } from "./teaching-card";

/** Public-facing profile: who you are at school. Security lives in Account settings. */
export function ProfilePage({ role }: { role: PortalRole }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <ProfileHero role={role} />

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="min-w-0 space-y-6">
            <SettingsCard id="personal" title="Personal details" description="As recorded by your school.">
              <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <Detail icon={UserRound} label="First name" value={user.first_name} />
                <Detail icon={UserRound} label="Last name" value={user.last_name || "—"} />
                {user.middle_name && <Detail icon={UserRound} label="Middle name" value={user.middle_name} />}
                <Detail icon={Mail} label="Email address" value={user.email} />
                <Detail icon={Phone} label="Mobile number" value={user.mobile_number || "—"} />
              </dl>
            </SettingsCard>

            {role === "teacher" && <TeachingCard />}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <SettingsCard id="school" title="School">
              <dl className="space-y-1">
                <Detail icon={School} label="School" value={user.school?.name ?? "—"} />
                <Detail icon={Hash} label="School code" value={user.school?.code ?? "—"} />
                <Detail icon={BadgeCheck} label="Role" value={roleAccent[role].label} />
              </dl>
            </SettingsCard>

            <Link
              href={`/${role}/settings`}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Account settings</span>
                <span className="block text-xs text-muted-foreground">Password, sign-in and security</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>

            <p className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              Need to correct your name, email or mobile number? Please contact your school office — they manage these
              details for you.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
