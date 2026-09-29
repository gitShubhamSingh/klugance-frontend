"use client";

import {
  CheckCheck,
  Clock3,
  FileText,
  Send,
} from "lucide-react";

const stats = [
  {
    label: "Sent",
    value: "128",
    description: "This month",
    icon: Send,
  },
  {
    label: "Delivered",
    value: "96%",
    description: "Delivery rate",
    icon: CheckCheck,
  },
  {
    label: "Scheduled",
    value: "8",
    description: "Upcoming",
    icon: Clock3,
  },
  {
    label: "Drafts",
    value: "5",
    description: "Need attention",
    icon: FileText,
  },
];

export function CommunicationStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>

              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}