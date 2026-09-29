"use client";

import {
  BusFront,
  Map,
  Users,
  AlertTriangle,
} from "lucide-react";

type Props = {
  totalBuses: number;
  activeRoutes: number;
  studentsUsingTransport: number;
  issues: number;
};

export function TransportStats({
  totalBuses,
  activeRoutes,
  studentsUsingTransport,
  issues,
}: Props) {
  const stats = [
    {
      label: "Total Buses",
      value: totalBuses,
      icon: BusFront,
    },
    {
      label: "Active Routes",
      value: activeRoutes,
      icon: Map,
    },
    {
      label: "Students",
      value: studentsUsingTransport,
      icon: Users,
    },
    {
      label: "Issues",
      value: issues,
      icon: AlertTriangle,
    },
  ];

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
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {stat.label}
            </p>

            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}