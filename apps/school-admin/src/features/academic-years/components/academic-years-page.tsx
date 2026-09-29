"use client";

import {
  AlertCircle,
  CalendarCheck2,
  CalendarDays,
  CalendarRange,
  Loader2,
  School,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAcademicYears } from "../hooks/use-academic-years";

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getDuration(
  startDate: string,
  endDate: string,
) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  const totalDays = Math.round(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24),
  ) + 1;

  const months = Math.floor(totalDays / 30);

  return {
    totalDays,
    months,
  };
}

export function AcademicYearsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useAcademicYears();

  const academicYear = data;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border bg-card p-8">
          <div className="flex items-center gap-4">
            <div className="size-14 animate-pulse rounded-2xl bg-muted" />

            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />

              <div className="h-10 w-64 animate-pulse rounded bg-muted" />

              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>

            <div>
              <h2 className="font-semibold text-destructive">
                Failed to load academic year
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading the academic year."}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  void refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!academicYear) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <CalendarRange className="size-7 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No Academic Year Available
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            There is currently no academic year configured
            for this school.
          </p>
        </div>
      </div>
    );
  }

  const duration = getDuration(
    academicYear.start_date,
    academicYear.end_date,
  );

  return (
    <div className="space-y-3 p-6">
      {/* ===================================================== */}
      {/* ACADEMIC YEAR HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden rounded-2xl bg-card">
        {/* Decorative background */}

        <div className="absolute inset-y-0 right-0 w-1/3 bg-muted/30" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Left */}

            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    academicYear.is_current
                      ? "default"
                      : "secondary"
                  }
                  className="rounded-full"
                >
                  {academicYear.is_current
                    ? "Current Session"
                    : "Inactive Session"}
                </Badge>

                {academicYear.is_current && (
                  <span className="text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  School Academic Session
                </p>

                <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {academicYear.name}
                </h2>

                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  The currently configured academic session
                  for your school.
                </p>
              </div>
            </div>

            {/* Right */}

            <div className="flex items-center gap-4 rounded-xl border bg-background/70 p-4 backdrop-blur-sm">
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <School className="size-5 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Academic Session
                </p>

                <p className="font-semibold">
                  {academicYear.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SESSION TIMELINE */}
      {/* ===================================================== */}

      <section className="rounded-2xl bg-card p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-semibold">
              Session Timeline
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The official duration of the current academic year.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Start */}

            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                <CalendarCheck2 className="size-5 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Session Starts
              </p>

              <p className="mt-1 text-lg font-semibold">
                {formatDate(academicYear.start_date)}
              </p>
            </div>

            {/* End */}

            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                <CalendarRange className="size-5 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Session Ends
              </p>

              <p className="mt-1 text-lg font-semibold">
                {formatDate(academicYear.end_date)}
              </p>
            </div>

            {/* Duration */}

            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-background">
                <CalendarDays className="size-5 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Academic Duration
              </p>

              <p className="mt-1 text-lg font-semibold">
                {duration.months} Months
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {duration.totalDays} days in this session
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CURRENT STATUS */}
      {/* ===================================================== */}

      {/* <section className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Academic Year Status
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current operational status of this academic session.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
            <div
              className={
                academicYear.is_current
                  ? "size-2 rounded-full bg-primary"
                  : "size-2 rounded-full bg-muted-foreground"
              }
            />

            <div>
              <p className="text-xs text-muted-foreground">
                Current Status
              </p>

              <p className="text-sm font-semibold">
                {academicYear.is_current
                  ? "Active Academic Year"
                  : "Inactive Academic Year"}
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}