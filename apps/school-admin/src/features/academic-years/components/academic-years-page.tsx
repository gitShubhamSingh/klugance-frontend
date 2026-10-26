"use client";

import {
  AlertCircle,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Flag,
  Hourglass,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAcademicYears } from "../hooks/use-academic-years";
import {
  formatLongDate,
  formatWeekday,
  getAcademicYearProgress,
  type AcademicYearProgress,
} from "../lib/academic-year-progress";

/* ── page ────────────────────────────────────────────────────────── */

export function AcademicYearsPage() {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useAcademicYears();

  const academicYear = data;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Academic Year</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The academic session currently configured for your school and how far along it is.
          </p>
        </div>

        {!isLoading && !isError && academicYear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="self-start sm:self-auto"
          >
            <RefreshCw className={cn(isFetching && "animate-spin")} />
            Refresh
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <div className="flex items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-semibold text-destructive">Failed to load academic year</h2>
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
              disabled={isFetching}
              onClick={() => {
                void refetch();
              }}
            >
              <RefreshCw className={cn(isFetching && "animate-spin")} />
              Try again
            </Button>
          </div>
        </div>
      ) : !academicYear ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <CalendarRange className="size-6 text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-semibold">No academic year available</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            There is currently no academic year configured for this school.
          </p>
        </div>
      ) : (
        <AcademicYearView
          name={academicYear.name}
          isCurrent={academicYear.is_current}
          startDate={academicYear.start_date}
          endDate={academicYear.end_date}
        />
      )}
    </div>
  );
}

/* ── content ─────────────────────────────────────────────────────── */

function AcademicYearView({
  name,
  isCurrent,
  startDate,
  endDate,
}: {
  name: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}) {
  const progress = getAcademicYearProgress(startDate, endDate);

  return (
    <>
      <HeroCard
        name={name}
        isCurrent={isCurrent}
        startDate={startDate}
        endDate={endDate}
        progress={progress}
      />

      {progress && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            icon={CalendarCheck2}
            label="Days completed"
            value={progress.elapsedDays.toLocaleString("en-IN")}
            hint={`of ${progress.totalDays.toLocaleString("en-IN")} days`}
          />
          <StatCard
            icon={Hourglass}
            label={progress.phase === "upcoming" ? "Starts in" : "Days remaining"}
            value={
              progress.phase === "upcoming"
                ? progress.daysUntilStart.toLocaleString("en-IN")
                : progress.remainingDays.toLocaleString("en-IN")
            }
            hint={
              progress.phase === "upcoming"
                ? "days"
                : progress.phase === "ended"
                  ? "Session has ended"
                  : "until the session ends"
            }
            highlight={progress.phase === "running"}
          />
          <StatCard
            icon={CalendarClock}
            label="Weeks remaining"
            value={progress.weeksRemaining.toLocaleString("en-IN")}
            hint={progress.phase === "ended" ? "Session has ended" : "approximately"}
          />
          <StatCard
            icon={CalendarRange}
            label="Total duration"
            value={`${progress.months} months`}
            hint={`${progress.totalDays.toLocaleString("en-IN")} days in this session`}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {progress && (
          <TimelineCard
            className="xl:col-span-2"
            progress={progress}
            startDate={startDate}
            endDate={endDate}
          />
        )}
        <DetailsCard
          className={cn(!progress && "xl:col-span-3")}
          name={name}
          isCurrent={isCurrent}
          startDate={startDate}
          endDate={endDate}
          progress={progress}
        />
      </div>
    </>
  );
}

/* ── hero ────────────────────────────────────────────────────────── */

function phaseText(p: AcademicYearProgress | null) {
  if (!p) return null;
  if (p.phase === "upcoming") {
    return `Session starts in ${p.daysUntilStart} ${p.daysUntilStart === 1 ? "day" : "days"}`;
  }
  if (p.phase === "ended") return "This session has ended";
  return `In progress · ${p.remainingDays} ${p.remainingDays === 1 ? "day" : "days"} remaining`;
}

function HeroCard({
  name,
  isCurrent,
  startDate,
  endDate,
  progress,
}: {
  name: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  progress: AcademicYearProgress | null;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge isCurrent={isCurrent} />
            {progress && (
              <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {phaseText(progress)}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Academic session
          </p>
          <h2 className="mt-1 truncate text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h2>

          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formatLongDate(startDate)}</span>
            <span aria-hidden>→</span>
            <span className="font-medium text-foreground">{formatLongDate(endDate)}</span>
          </p>

          {progress && (
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Session progress</span>
                <span className="text-muted-foreground tabular-nums">
                  {progress.percent}% complete
                </span>
              </div>
              <div
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress.percent}
                aria-label="Academic year progress"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {progress && (
          <div className="flex items-center gap-5 rounded-xl border bg-muted/30 p-4 lg:flex-col lg:gap-3 lg:p-6">
            <ProgressRing percent={progress.percent} />
            <div className="lg:text-center">
              <p className="text-sm font-semibold">
                {progress.phase === "running"
                  ? `Day ${progress.elapsedDays} of ${progress.totalDays}`
                  : progress.phase === "upcoming"
                    ? "Not started yet"
                    : "Completed"}
              </p>
              <p className="text-xs text-muted-foreground">
                {progress.phase === "running"
                  ? `${progress.remainingDays} days to go`
                  : `${progress.totalDays} days in total`}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ isCurrent }: { isCurrent: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isCurrent
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isCurrent ? "bg-emerald-500" : "bg-muted-foreground/60",
        )}
      />
      {isCurrent ? "Current session" : "Inactive session"}
    </span>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative size-24 shrink-0 lg:size-32">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" className="stroke-muted" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight tabular-nums lg:text-3xl">{percent}%</span>
        <span className="text-xs text-muted-foreground">complete</span>
      </div>
    </div>
  );
}

/* ── stats ───────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5",
        highlight && "border-primary/30 bg-primary/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg p-2", highlight ? "bg-primary/10" : "bg-muted")}>
          <Icon className={cn("size-4", highlight ? "text-primary" : "text-muted-foreground")} />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

/* ── timeline ────────────────────────────────────────────────────── */

function TimelineCard({
  progress,
  startDate,
  endDate,
  className,
}: {
  progress: AcademicYearProgress;
  startDate: string;
  endDate: string;
  className?: string;
}) {
  const todayLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date());
  const markerLeft = Math.min(Math.max(progress.percent, 2), 98);

  return (
    <section className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">Session timeline</h2>
          <p className="text-xs text-muted-foreground">Month by month, from start to finish</p>
        </div>
        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <Legend className="bg-primary" label="Completed" />
          <Legend className="bg-primary/40" label="Current month" />
          <Legend className="bg-muted" label="Upcoming" />
        </div>
      </header>

      <div className="p-5 sm:p-6">
        <div className="relative pt-9">
          {/* Today marker */}
          {progress.phase === "running" && (
            <div className="absolute top-0 -translate-x-1/2" style={{ left: `${markerLeft}%` }}>
              <span className="block rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-primary-foreground shadow-sm">
                Today · {todayLabel}
              </span>
              <span className="mx-auto block h-3 w-px bg-primary" />
            </div>
          )}

          {/* Month segments (width follows the days in each month) */}
          <div className="flex gap-1">
            {progress.segments.map((s) => (
              <div key={s.key} className="min-w-0" style={{ flexGrow: s.days, flexBasis: 0 }}>
                <div
                  className={cn(
                    "h-3 rounded-sm",
                    s.state === "done" && "bg-primary",
                    s.state === "current" && "bg-primary/40 ring-2 ring-primary/30",
                    s.state === "upcoming" && "bg-muted",
                  )}
                  title={`${s.label} ${s.year}`}
                />
                <p
                  className={cn(
                    "mt-2 truncate text-center text-[11px]",
                    s.state === "current" ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <TimelineEnd icon={CalendarCheck2} label="Session starts" date={startDate} />
          <TimelineEnd icon={Flag} label="Session ends" date={endDate} alignEnd />
        </div>
      </div>
    </section>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm", className)} />
      {label}
    </span>
  );
}

function TimelineEnd({
  icon: Icon,
  label,
  date,
  alignEnd,
}: {
  icon: LucideIcon;
  label: string;
  date: string;
  alignEnd?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg bg-muted/40 p-3",
        alignEnd && "sm:flex-row-reverse sm:text-right",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{formatLongDate(date)}</p>
        <p className="text-xs text-muted-foreground">{formatWeekday(date)}</p>
      </div>
    </div>
  );
}

/* ── details ─────────────────────────────────────────────────────── */

function DetailsCard({
  name,
  isCurrent,
  startDate,
  endDate,
  progress,
  className,
}: {
  name: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  progress: AcademicYearProgress | null;
  className?: string;
}) {
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Session name", value: name },
    { label: "Status", value: <StatusBadge isCurrent={isCurrent} /> },
    { label: "Start date", value: formatLongDate(startDate) },
    { label: "End date", value: formatLongDate(endDate) },
    {
      label: "Duration",
      value: progress ? `${progress.months} months · ${progress.totalDays} days` : "—",
    },
    {
      label: "Progress",
      value: progress ? `${progress.percent}% complete` : "—",
    },
  ];

  return (
    <section className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <header className="border-b px-5 py-4">
        <h2 className="font-semibold">Session details</h2>
        <p className="text-xs text-muted-foreground">Key information at a glance</p>
      </header>
      <dl className="divide-y px-5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-right text-sm font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── loading ─────────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-56 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-56 animate-pulse rounded-xl bg-muted xl:col-span-2" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
