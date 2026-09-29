"use client";

import { CommunicationHeader } from "./communication-header";
import { CommunicationStats } from "./communication-stats";
import { CommunicationTabs } from "./communication-tabs";

export function CommunicationPage() {
  return (
    <div className="space-y-6 p-6">
      <CommunicationHeader />

      <CommunicationStats />

      <CommunicationTabs />
    </div>
  );
}