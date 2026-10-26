"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClasses } from "@/features/classes/hooks/use-classes";

import { useDashboard } from "../hooks/use-dashboard";
import { ClassSetupCard } from "./class-setup-card";
import { DashboardHeader } from "./dashboard-header";
import { PeriodsCard } from "./periods-card";
import { RecentAdmissionsCard, RecentTeachersCard } from "./recent-lists";
import { StudentsByClassCard } from "./students-by-class-card";
import { SummaryCards } from "./summary-cards";

/**
 * School-admin dashboard (v1: academics, teachers, students, timetable).
 * Everything shown comes from existing API endpoints — no placeholder data.
 */
export function DashboardOverview() {
  const dashboard = useDashboard();
  const academicYearId = dashboard.data?.academic_year?.id;
  const classes = useClasses(academicYearId);

  if (dashboard.isPending) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl bg-muted xl:col-span-2" />
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (dashboard.isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <div>
          <h2 className="font-semibold">Unable to load dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard information could not be loaded.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => dashboard.refetch()}>
          <RefreshCw />
          Try again
        </Button>
      </div>
    );
  }

  const data = dashboard.data;

  return (
    <div className="space-y-6">
      <DashboardHeader data={data} />

      <SummaryCards data={data} />

      <div className="grid gap-6 xl:grid-cols-3">
        <ClassSetupCard academicYearId={academicYearId} />
        <PeriodsCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <StudentsByClassCard classes={classes.data} />
        <RecentAdmissionsCard />
        <RecentTeachersCard />
      </div>
    </div>
  );
}
