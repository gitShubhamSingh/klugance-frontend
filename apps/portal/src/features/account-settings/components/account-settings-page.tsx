"use client";

import { useEffect, useState } from "react";
import { CircleUserRound, KeyRound, LogOut, type LucideIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

import { AccountSection } from "./account-section";
import { PasswordSection } from "./password-section";
import { SignOutSection } from "./sign-out-section";

const sections: Array<{ id: string; label: string; hint: string; icon: LucideIcon }> = [
  { id: "account", label: "Account", hint: "Sign-in & status", icon: CircleUserRound },
  { id: "password", label: "Password & security", hint: "Change your password", icon: KeyRound },
  { id: "session", label: "Session", hint: "Sign out", icon: LogOut },
];

/** Shared account settings for any portal user (teacher, student, parent). */
export function AccountSettingsPage() {
  const [active, setActive] = useState(sections[0]!.id);

  // Highlight the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function goTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account settings</h1>
          <p className="mt-2 text-muted-foreground">Manage how you sign in and keep your account secure.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
          {/* Section navigation */}
          <nav
            aria-label="Settings sections"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          >
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors lg:border-transparent lg:py-2.5",
                    isActive ? "bg-card shadow-sm lg:border-border" : "bg-card/50 hover:bg-muted lg:bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-medium whitespace-nowrap">{s.label}</span>
                    <span className="hidden text-xs text-muted-foreground lg:block">{s.hint}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="min-w-0 space-y-6">
            <AccountSection />
            <PasswordSection />
            <SignOutSection />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
