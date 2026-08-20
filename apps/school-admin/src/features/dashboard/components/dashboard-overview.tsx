"use client";

import {
  BookOpen,
  GraduationCap,
  LayoutGrid,
  School,
  Users,
} from "lucide-react";

import { useDashboard } from "../hooks/use-dashboard";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-2.5">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function DashboardOverview() {
  const dashboard = useDashboard();

  if (dashboard.isPending) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (dashboard.isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold">
          Unable to load dashboard
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Dashboard information could not be loaded.
        </p>
      </div>
    );
  }

  const data = dashboard.data;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <School className="size-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {data.school_name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{data.school_code}</span>

              <span>•</span>

              <span>
                {data.academic_year
                  ? `Academic Year ${data.academic_year.name}`
                  : "No active academic year"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            School Overview
          </h2>

          <p className="text-sm text-muted-foreground">
            Current operational snapshot of your school.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Students"
            value={data.summary.total_students}
            description="Active students in current academic year"
            icon={GraduationCap}
          />

          <MetricCard
            title="Teachers"
            value={data.summary.total_teachers}
            description="Active teaching staff"
            icon={Users}
          />

          <MetricCard
            title="Classes"
            value={data.summary.total_classes}
            description="Classes configured for the school"
            icon={BookOpen}
          />

          <MetricCard
            title="Sections"
            value={data.summary.total_sections}
            description="Sections across all classes"
            icon={LayoutGrid}
          />
        </div>
      </section>
    </div>
  );
}