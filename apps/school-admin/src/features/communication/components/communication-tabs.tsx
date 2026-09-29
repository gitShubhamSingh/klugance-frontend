"use client";

import { useState } from "react";

import {
  Bell,
  FileText,
  Inbox,
  Send,
} from "lucide-react";

type Tab =
  | "all"
  | "announcements"
  | "sent"
  | "drafts";

const tabs: {
  value: Tab;
  label: string;
  icon: typeof Inbox;
}[] = [
  {
    value: "all",
    label: "All",
    icon: Inbox,
  },
  {
    value: "announcements",
    label: "Announcements",
    icon: Bell,
  },
  {
    value: "sent",
    label: "Sent",
    icon: Send,
  },
  {
    value: "drafts",
    label: "Drafts",
    icon: FileText,
  },
];

export function CommunicationTabs() {
  const [activeTab, setActiveTab] =
    useState<Tab>("all");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border bg-muted/40 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setActiveTab(tab.value)
              }
              className={[
                "inline-flex h-9 shrink-0 items-center justify-center",
                "rounded-lg px-3 text-sm font-medium",
                "transition-colors",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="mr-2 size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "all" && (
        <CommunicationEmptyState
          title="No communications yet"
          description="Your school's announcements and messages will appear here."
        />
      )}

      {activeTab === "announcements" && (
        <CommunicationEmptyState
          title="No announcements"
          description="School announcements will appear here."
        />
      )}

      {activeTab === "sent" && (
        <CommunicationEmptyState
          title="No sent communications"
          description="Communications sent by the school will appear here."
        />
      )}

      {activeTab === "drafts" && (
        <CommunicationEmptyState
          title="No drafts"
          description="Saved communication drafts will appear here."
        />
      )}
    </div>
  );
}

function CommunicationEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}