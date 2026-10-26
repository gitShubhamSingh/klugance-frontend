"use client";

import Link from "next/link";
import { CalendarDays, TriangleAlert } from "lucide-react";

import { useAuthStore } from "@/core/auth";

import type { SchoolDashboard } from "../types";
import { academicYearProgress, formatDate, greeting } from "../lib/dashboard-format";

export function DashboardHeader({ data }: { data: SchoolDashboard }) {
  const firstName = useAuthStore((state) => state.user?.first_name);
  const year = data.academic_year;
  const progress = year ? academicYearProgress(year.start_date, year.end_date) : null;

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {greeting()}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.school_name} · {data.school_code}
        </p>
      </div>

      {year ? (
        <div className="w-full rounded-lg border bg-muted/40 p-4 lg:max-w-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="size-4 text-muted-foreground" />
              Academic year {year.name}
            </span>
            {progress?.state === "running" && (
              <span className="text-xs font-medium tabular-nums">{progress.percent}%</span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(year.start_date)} – {formatDate(year.end_date)}
          </p>
          {progress && (
            <>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {progress.state === "running" &&
                  `Day ${progress.elapsed} of ${progress.totalDays} · ${progress.totalDays - progress.elapsed} days left`}
                {progress.state === "upcoming" && "Starts soon"}
                {progress.state === "ended" && "This academic year has ended"}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex w-full items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 lg:max-w-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium">No current academic year</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Classes, students and timetables depend on it.
            </p>
            <Link
              href="/academics/academic-years"
              className="mt-2 inline-block text-xs font-medium underline-offset-4 hover:underline"
            >
              Set academic year →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
