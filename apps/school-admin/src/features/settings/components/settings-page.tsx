"use client";

import { useState } from "react";

import { SettingsHeader } from "./settings-header";
import { SettingsNavigation } from "./settings-navigation";
import { SettingsOverview } from "./settings-overview";
import { AccountSecurity } from "./account-security";
import { BillingSection } from "./billing-section";
import { SupportSection } from "./support-section";
import { FeedbackSection } from "./feedback-section";

type SettingsSection =
  | "overview"
  | "security"
  | "billing"
  | "support"
  | "feedback";

export function SettingsPage() {
  const [section, setSection] =
    useState<SettingsSection>("overview");

  return (
    <div className="space-y-6 p-6">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SettingsNavigation
          section={section}
          onSectionChange={setSection}
        />

        <main className="min-w-0">
          {section === "overview" && (
            <SettingsOverview
              onNavigate={setSection}
            />
          )}

          {section === "security" && (
            <AccountSecurity />
          )}

          {section === "billing" && (
            <BillingSection />
          )}

          {section === "support" && (
            <SupportSection />
          )}

          {section === "feedback" && (
            <FeedbackSection />
          )}
        </main>
      </div>
    </div>
  );
}