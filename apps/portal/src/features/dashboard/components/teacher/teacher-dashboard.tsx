"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Megaphone,
  MoonStar,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import type { CurrentUser } from "@/core/auth/types/auth.types";
import {
  formatTime,
  minutesBetween,
  toMinutes,
} from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import {
  toLocalDateKey,
  useTeacherDashboard,
} from "../../hooks/use-teacher-dashboard";
import type {
  TeacherDashboard as TeacherDashboardData,
  TeacherDashboardPeriod,
} from "../../types/teacher-dashboard";
import { formatToday, getDisplayName, getGreeting } from "../../lib/dashboard-utils";
import { chartTooltipLabelStyle, chartTooltipStyle } from "../shared/chart-tooltip";
import { LiveClock } from "../shared/live-clock";
import { SectionCard } from "../shared/section-card";

type Props = {
  user: CurrentUser;
};

const quickActions = [
  { title: "Take attendance", href: "/teacher/attendance", icon: CalendarCheck },
  { title: "Assign homework", href: "/teacher/homework", icon: BookOpenCheck },
  { title: "Enter marks", href: "/teacher/exams", icon: FileText },
  { title: "Message office", href: "/teacher/communication?to=SCHOOL", icon: Megaphone },
];

/** Re-renders every 30s so the current / next periods move on their own. */
function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/* ── schedule helpers (today's periods from the API) ─────────────── */

function nowMinutes(now: Date) {
  return now.getHours() * 60 + now.getMinutes();
}

function getLineup(schedule: TeacherDashboardPeriod[], now: Date) {
  const mins = nowMinutes(now);

  const current = schedule.find(
    (p) => mins >= toMinutes(p.start_time) && mins < toMinutes(p.end_time),
  );
  const upcoming = schedule.filter((p) => toMinutes(p.start_time) > mins).slice(0, 2);
  const remaining = schedule.filter((p) => toMinutes(p.end_time) > mins).length;

  return { current, upcoming, remaining, total: schedule.length };
}

function describeNow(
  schedule: TeacherDashboardPeriod[],
  now: Date,
): { label: string; live: boolean } {
  if (schedule.length === 0) return { label: "No classes today", live: false };

  const mins = nowMinutes(now);
  const first = schedule[0]!;
  const last = schedule[schedule.length - 1]!;

  if (mins < toMinutes(first.start_time)) {
    return { label: `First class at ${formatTime(first.start_time)}`, live: false };
  }
  if (mins >= toMinutes(last.end_time)) {
    return { label: "Classes are over for today", live: false };
  }

  const current = schedule.find(
    (p) => mins >= toMinutes(p.start_time) && mins < toMinutes(p.end_time),
  );
  if (current) return { label: `${current.period_name} in progress`, live: true };

  const next = schedule.find((p) => toMinutes(p.start_time) > mins);
  return {
    label: next ? `Free until ${formatTime(next.start_time)}` : "Free period",
    live: false,
  };
}

function formatPercent(value: number | null) {
  return value === null ? "—" : `${Math.round(value)}%`;
}

function attendanceTrend(current: number | null, previous: number | null) {
  if (current === null) return "No attendance marked in the last 30 days";
  if (previous === null) return "Last 30 days";
  const diff = Math.round((current - previous) * 10) / 10;
  return `${diff >= 0 ? "+" : ""}${diff}% vs previous 30 days`;
}

/* ── component ───────────────────────────────────────────────────── */

export function TeacherDashboard({ user }: Props) {
  const now = useMinuteClock();
  const dateKey = toLocalDateKey(now);

  const dashboardQuery = useTeacherDashboard(dateKey);
  const data = dashboardQuery.data;

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {/* ── Header: greeting + live clock ────────────────────────── */}
        <DashboardHeader user={user} now={now} data={data} />

        {dashboardQuery.isLoading ? (
          <DashboardSkeleton />
        ) : dashboardQuery.isError || !data ? (
          <ErrorState
            message={getErrorMessage(dashboardQuery.error)}
            onRetry={() => void dashboardQuery.refetch()}
          />
        ) : (
          <DashboardBody data={data} now={now} />
        )}
      </div>
    </PageContainer>
  );
}

function DashboardHeader({
  user,
  now,
  data,
}: {
  user: CurrentUser;
  now: Date;
  data: TeacherDashboardData | undefined;
}) {
  const status = data ? describeNow(data.today_schedule, now) : null;

  const details = [
    data?.teacher.subjects.length ? data.teacher.subjects.join(", ") : null,
    data?.teacher.employee_code ? `ID ${data.teacher.employee_code}` : null,
    user.school?.name ?? null,
  ].filter(Boolean);

  return (
    <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{formatToday(now)}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {getGreeting(now)}, {getDisplayName(user)}
        </h1>
        {details.length > 0 && (
          <p className="mt-1.5 text-sm text-muted-foreground">{details.join(" · ")}</p>
        )}
      </div>

      <div className="flex items-center gap-4 rounded-xl border bg-muted/40 px-4 py-3 md:min-w-64 md:flex-col md:items-end md:gap-1 md:px-5">
        <LiveClock className="text-3xl md:text-4xl" />
        {status && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              status.live ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {status.live && <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
            {status.label}
          </span>
        )}
      </div>
    </section>
  );
}

function DashboardBody({ data, now }: { data: TeacherDashboardData; now: Date }) {
  const { summary } = data;
  const lineup = getLineup(data.today_schedule, now);
  const done = lineup.total - lineup.remaining;
  const status = describeNow(data.today_schedule, now);

  const performance = useMemo(
    () =>
      data.class_performance.map((item) => ({
        className: `${item.class_name} – ${item.section_name}`,
        avgScore: item.avg_score_percent,
        attendance: item.attendance_percent,
      })),
    [data.class_performance],
  );

  const hasPerformance = performance.some(
    (item) => item.avgScore !== null || item.attendance !== null,
  );

  return (
    <>
      {/* ── Today: now / next / after that ───────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Today&apos;s classes</h2>
            <p className="text-sm text-muted-foreground">
              {lineup.total === 0
                ? "No classes scheduled today"
                : `${done} of ${lineup.total} done · ${lineup.remaining} remaining`}
            </p>
          </div>
          <Link href="/teacher/timetable" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Full timetable
            <ArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {lineup.current ? (
            <LessonCard kind="now" period={lineup.current} now={now} />
          ) : (
            <IdleCard label={status.label} />
          )}
          {[0, 1].map((i) => {
            const item = lineup.upcoming[i];
            return item ? (
              <LessonCard
                key={item.timetable_entry_id}
                kind={i === 0 ? "next" : "later"}
                period={item}
                now={now}
              />
            ) : (
              <EmptyCard key={`empty-${i}`} text={i === 0 ? "No more classes today" : "Nothing after that"} />
            );
          })}
        </div>
      </section>

      {/* ── Key numbers ──────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          icon={CalendarClock}
          label="Classes today"
          value={`${lineup.total}`}
          hint={
            summary.attendance_pending_today > 0
              ? `${done} completed · attendance pending for ${summary.attendance_pending_today}`
              : `${done} completed`
          }
          progress={lineup.total ? (done / lineup.total) * 100 : 0}
        />
        <KpiCard
          icon={UsersRound}
          label="My students"
          value={`${summary.total_students}`}
          hint={`Across ${summary.total_sections} ${summary.total_sections === 1 ? "section" : "sections"}`}
        />
        <KpiCard
          icon={ClipboardList}
          label="To review"
          value={`${summary.homework_to_review}`}
          hint="Homework submissions"
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg. attendance"
          value={formatPercent(summary.avg_attendance_percent)}
          hint={attendanceTrend(summary.avg_attendance_percent, summary.previous_attendance_percent)}
        />
      </section>

      {/* ── Quick actions ────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-3.5 transition-colors hover:bg-muted/50 sm:p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-background sm:size-10">
                <Icon className="size-4.5" />
              </span>
              <span className="min-w-0 truncate text-sm font-medium">{action.title}</span>
              <ArrowRight className="ml-auto hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
            </Link>
          );
        })}
      </section>

      {/* ── Class performance ────────────────────────────────────── */}
      <SectionCard
        title="Class performance"
        description={`Average score and attendance by section${data.academic_year ? ` · ${data.academic_year.name}` : ""}`}
        icon={TrendingUp}
        action={
          hasPerformance ? (
            <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
              <Legend color="bg-primary" label="Avg. score" />
              <Legend color="bg-muted-foreground/30" label="Attendance" />
            </div>
          ) : undefined
        }
      >
        {hasPerformance ? (
          <div className="h-64 text-muted-foreground sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance} barGap={6} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
                <XAxis dataKey="className" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "currentColor", fillOpacity: 0.05 }}
                  contentStyle={chartTooltipStyle}
                  labelStyle={chartTooltipLabelStyle}
                  formatter={(value) => (value === null || value === undefined ? "—" : `${value}%`)}
                />
                <Bar dataKey="avgScore" name="Avg. score" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="attendance" name="Attendance" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {performance.length === 0
              ? "You have no classes assigned yet."
              : "Scores and attendance will appear here once marks and attendance are recorded."}
          </p>
        )}
      </SectionCard>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

const kindMeta = {
  now: { label: "Now", chip: "bg-primary text-primary-foreground" },
  next: { label: "Next", chip: "border border-primary/30 text-foreground" },
  later: { label: "After that", chip: "border text-muted-foreground" },
} as const;

function LessonCard({
  kind,
  period,
  now,
}: {
  kind: keyof typeof kindMeta;
  period: TeacherDashboardPeriod;
  now: Date;
}) {
  const meta = kindMeta[kind];
  const isNow = kind === "now";
  const startsIn = minutesBetween(now, period.start_time);

  const length = Math.max(1, toMinutes(period.end_time) - toMinutes(period.start_time));
  const left = Math.max(0, minutesBetween(now, period.end_time));
  const progress = Math.min(100, Math.round(((length - left) / length) * 100));

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5",
        isNow && "border-primary/40 shadow-sm ring-1 ring-primary/30",
        kind === "later" && "opacity-85",
      )}
    >
      {isNow && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-primary" />}

      <div className="flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-semibold", meta.chip)}>
          {isNow && <span className="size-1.5 animate-pulse rounded-full bg-white" />}
          {meta.label}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {period.period_name} · {formatTime(period.start_time)} – {formatTime(period.end_time)}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">
        {period.class_name} – {period.section_name}
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{period.subject_name}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <UsersRound className="size-4 text-muted-foreground" />
          <span className="font-medium tabular-nums">
            {period.attendance_marked && period.students_present !== null
              ? `${period.students_present}/${period.student_count}`
              : period.student_count}
          </span>
          <span className="text-muted-foreground">
            {period.attendance_marked ? "present" : "students"}
          </span>
        </span>
        {period.attendance_marked && (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="size-4" />
            Attendance marked
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        {isNow ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{left} min left</span>
            </div>
            {!period.attendance_marked && (
              <Link href="/teacher/attendance" className={cn(buttonVariants({ size: "sm" }), "w-full")}>
                <CalendarCheck />
                Take attendance
              </Link>
            )}
          </div>
        ) : (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />
            Starts in {startsIn < 60 ? `${startsIn} min` : `${Math.floor(startsIn / 60)} h ${startsIn % 60} min`}
          </p>
        )}
      </div>
    </article>
  );
}

function IdleCard({ label }: { label: string }) {
  return (
    <article className="flex flex-col rounded-2xl border border-dashed bg-card p-5">
      <span className="w-fit rounded-full bg-muted px-2 py-0.5 text-2xs font-semibold text-muted-foreground">Now</span>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
          <MoonStar className="size-5 text-muted-foreground" />
        </span>
        <div>
          <p className="font-medium">No class right now</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </article>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <article className="flex items-center justify-center rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
      {text}
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <h2 className="mt-3 font-semibold">Unable to load your dashboard</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  progress,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  progress?: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border bg-card p-3.5 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-sm leading-snug font-medium text-muted-foreground">{label}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-9 sm:rounded-xl">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums sm:mt-4">{value}</p>
      {typeof progress === "number" && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm", color)} />
      {label}
    </span>
  );
}
