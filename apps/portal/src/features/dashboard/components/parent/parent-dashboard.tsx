"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bus,
  CalendarCheck,
  CalendarClock,
  CalendarHeart,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MessageCircleHeart,
  Phone,
  ShieldCheck,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import type { CurrentUser } from "@/core/auth/types/auth.types";
import {
  ChildSwitcher,
  LoadErrorState,
  NoChildrenState,
  childClassLabel,
  childName,
  childTone,
  useSelectedChild,
} from "@/features/parent-children";
import { useConversations } from "@/features/communication";
import { listTimeLabel, timeLabel } from "@/features/communication/lib/chat-utils";
import { formatTime, toMinutes } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { toLocalDateKey } from "../../hooks/use-teacher-dashboard";
import { useParentDashboard } from "../../hooks/use-parent-dashboard";
import {
  formatCurrency,
  formatToday,
  getDisplayName,
  getGreeting,
} from "../../lib/dashboard-utils";
import { toneStyles, type Tone } from "../../lib/tones";
import type {
  AttendanceStatusValue,
  DayStatusValue,
  ParentDashboard as ParentDashboardData,
  ParentPeriod,
  ParentTransport,
} from "../../types/parent-dashboard";
import { chartTooltipLabelStyle, chartTooltipStyle } from "../shared/chart-tooltip";
import { InitialsAvatar } from "../shared/initials-avatar";
import { SectionCard } from "../shared/section-card";

type Props = {
  user: CurrentUser;
};

/** Re-renders every 30s so today's classes move on their own. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const todayStatusMeta: Record<DayStatusValue, { label: string; className: string }> = {
  PRESENT: { label: "Present today", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  LATE: { label: "Late for a period today", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  PARTIAL: { label: "Missed some periods today", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  ABSENT: { label: "Absent today", className: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
  LEAVE: { label: "On leave today", className: "bg-muted text-muted-foreground" },
};

const periodMarkMeta: Record<AttendanceStatusValue, { label: string; className: string }> = {
  PRESENT: { label: "Present", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  LATE: { label: "Late", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  HALF_DAY: { label: "Half day", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  ABSENT: { label: "Absent", className: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
  LEAVE: { label: "Leave", className: "bg-muted text-muted-foreground" },
};

function formatPercent(value: number | null) {
  return value === null ? "—" : `${Math.round(value)}%`;
}

export function ParentDashboard({ user }: Props) {
  const now = useNow();
  const dateKey = toLocalDateKey(now);

  const { childrenQuery, children, child, setChildId } = useSelectedChild();
  const dashboardQuery = useParentDashboard(child?.student_profile_id ?? null, dateKey);

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ── Greeting + child switcher ────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{formatToday(now)}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {getGreeting(now)}, {getDisplayName(user)}
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              Here&apos;s how your {children.length > 1 ? "children are" : "child is"} doing today.
            </p>
          </div>

          <ChildSwitcher
            options={children}
            value={child?.student_profile_id ?? null}
            onChange={setChildId}
            className="lg:self-auto"
          />
        </div>

        {childrenQuery.isLoading || (child && dashboardQuery.isLoading) ? (
          <DashboardSkeleton />
        ) : childrenQuery.isError ? (
          <LoadErrorState
            title="Unable to load your children"
            message={getErrorMessage(childrenQuery.error)}
            onRetry={() => void childrenQuery.refetch()}
          />
        ) : !child ? (
          <NoChildrenState />
        ) : dashboardQuery.isError || !dashboardQuery.data ? (
          <LoadErrorState
            title={`Unable to load ${child.first_name}'s dashboard`}
            message={getErrorMessage(dashboardQuery.error)}
            onRetry={() => void dashboardQuery.refetch()}
          />
        ) : (
          <DashboardBody
            data={dashboardQuery.data}
            tone={childTone(children, child)}
            now={now}
          />
        )}
      </div>
    </PageContainer>
  );
}

function DashboardBody({ data, tone: toneName, now }: { data: ParentDashboardData; tone: Tone; now: Date }) {
  const child = data.child;
  const tone = toneStyles[toneName];
  const name = childName(child);
  const status = data.today_status ? todayStatusMeta[data.today_status] : null;

  const performance = data.exam_scores.map((e) => ({
    term: e.exam_name,
    score: e.score_percent,
    classAvg: e.section_average_percent,
  }));

  return (
    <>
      {/* ── Child hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="flex min-w-0 items-center gap-5">
            <div className="relative">
              <InitialsAvatar name={name} tone={toneName} size="xl" className="ring-4 ring-background" />
              {data.today_status === "PRESENT" && (
                <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-card">
                  <CheckCircle2 className="size-3.5" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  status ? status.className : "bg-muted text-muted-foreground",
                )}
              >
                <ShieldCheck className="size-3.5" />
                {status ? status.label : "Attendance not marked yet today"}
              </span>
              <h2 className="mt-2 truncate text-2xl font-semibold tracking-tight">{name}</h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-4" />
                  {childClassLabel(child)}
                  {child.roll_number && ` · Roll ${child.roll_number}`}
                </span>
                {child.class_teachers.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="size-4" />
                    {child.class_teachers.join(", ")}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeroMetric icon={CalendarCheck} label="Attendance" value={formatPercent(data.attendance_percent)} note="This year" />
            <HeroMetric icon={TrendingUp} label="Avg. score" value={formatPercent(data.avg_score_percent)} note="All exams" />
            <HeroMetric icon={BookOpen} label="Homework" value={`${data.homework_due.length}`} note="Due this week" />
          </div>
        </div>
      </section>

      {/* ── Today + fees/transport ───────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title={`${child.first_name}'s classes today`}
          description="Timetable with attendance marked for each period"
          icon={CalendarClock}
          iconClassName={cn(tone.soft, tone.text)}
        >
          {data.today_schedule.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No classes on the timetable today.</p>
          ) : (
            <ol className="relative">
              {data.today_schedule.map((period, i) => (
                <ScheduleRow
                  key={`${period.start_time}-${i}`}
                  period={period}
                  mark={data.today_periods.find((m) => m.start_time === period.start_time)?.status ?? null}
                  now={now}
                  isLast={i === data.today_schedule.length - 1}
                />
              ))}
            </ol>
          )}

          {data.homework_due.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <p className="text-sm font-medium">Homework due this week</p>
              <ul className="mt-2 space-y-2">
                {data.homework_due.map((hw) => (
                  <li key={hw.id} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{hw.title}</span>
                      <span className="block text-xs text-muted-foreground">{hw.subject_name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      Due {new Date(`${hw.due_date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SectionCard>

        <div className="flex flex-col gap-6">
          <FeeCard data={data} />
          <TransportCard transport={data.transport} />
        </div>
      </div>

      {/* ── Progress + attendance calendar ───────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Academic progress"
          description={`${child.first_name}'s exam scores vs the section average`}
          icon={TrendingUp}
          iconClassName={cn(tone.soft, tone.text)}
        >
          {performance.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Exam results appear here once marks are published.
            </p>
          ) : (
            <div className="h-72 text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="parent-score" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tone.hex} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={tone.hex} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
                  <XAxis dataKey="term" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={chartTooltipLabelStyle}
                    formatter={(value) => (value === null || value === undefined ? "—" : `${value}%`)}
                  />
                  <Area
                    type="monotone"
                    dataKey="classAvg"
                    name="Section avg."
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    fill="transparent"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name={child.first_name}
                    stroke={tone.hex}
                    fill="url(#parent-score)"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: tone.hex, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Attendance calendar"
          description={monthLabel(data.month)}
          icon={CalendarHeart}
          iconClassName={cn(tone.soft, tone.text)}
          action={
            <Link href="/parent/attendance" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Details
              <ArrowRight />
            </Link>
          }
        >
          <AttendanceCalendar data={data} />
        </SectionCard>
      </div>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <RecentMessages tone={toneName} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function HeroMetric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 backdrop-blur">
      <Icon className="size-4 text-muted-foreground" />
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-2xs text-muted-foreground">{note}</p>
    </div>
  );
}

function ScheduleRow({
  period,
  mark,
  now,
  isLast,
}: {
  period: ParentPeriod;
  mark: AttendanceStatusValue | null;
  now: Date;
  isLast: boolean;
}) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const state =
    mins >= toMinutes(period.end_time) ? "done" : mins >= toMinutes(period.start_time) ? "live" : "upcoming";
  const done = state === "done";
  const live = state === "live";

  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            "z-10 flex size-8 items-center justify-center rounded-full border-2",
            done && "border-primary bg-primary text-primary-foreground",
            live && "border-primary bg-card text-foreground",
            state === "upcoming" && "border-dashed border-muted-foreground/40 bg-card",
          )}
        >
          {done && <CheckCircle2 className="size-4" />}
          {live && <span className="size-2.5 animate-pulse rounded-full bg-primary" />}
        </span>
        {!isLast && (
          <span className={cn("absolute top-8 -bottom-0 w-0.5", done ? "bg-primary/60" : "bg-border")} />
        )}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          live && "bg-muted/60 ring-1 ring-border",
        )}
      >
        <div className="min-w-0">
          <p className={cn("text-sm font-medium", state === "upcoming" && "text-muted-foreground")}>
            {period.subject_name}
            {live && " · in progress"}
          </p>
          <p className="text-xs text-muted-foreground">
            {period.period_name}
            {period.teacher_name && ` · ${period.teacher_name}`}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2">
          {mark && (
            <span className={cn("rounded-full px-2 py-0.5 text-2xs font-medium", periodMarkMeta[mark].className)}>
              {periodMarkMeta[mark].label}
            </span>
          )}
          <span className={cn("text-xs tabular-nums", live ? "font-medium text-foreground" : "text-muted-foreground")}>
            {formatTime(period.start_time)} – {formatTime(period.end_time)}
          </span>
        </span>
      </div>
    </li>
  );
}

function FeeCard({ data }: { data: ParentDashboardData }) {
  const fee = data.fees;
  const paidPercent = fee.total_amount ? Math.round((fee.paid_amount / fee.total_amount) * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
      <div className="relative">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
          <WalletCards className="size-4" />
          {fee.due_amount > 0 ? "Fee due" : "Fees"}
        </span>

        {fee.invoice_count === 0 ? (
          <p className="mt-4 text-sm text-primary-foreground/80">No fee invoices yet.</p>
        ) : (
          <>
            <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(fee.next_due_amount ?? 0)}
            </p>
            <p className="text-xs text-primary-foreground/60">
              {fee.next_due_structure_name
                ? `${fee.next_due_structure_name} · ${fee.next_due_invoice_number}`
                : "All invoices paid"}
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-2xs text-primary-foreground/70">
                <span>Paid {formatCurrency(fee.paid_amount)}</span>
                <span>of {formatCurrency(fee.total_amount)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15">
                <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${paidPercent}%` }} />
              </div>
            </div>
          </>
        )}

        <Link
          href="/parent/fees"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "mt-5 w-full",
          )}
        >
          Invoices & receipts
        </Link>
      </div>
    </section>
  );
}

function tripStatus(transport: ParentTransport) {
  const latest = transport.today_trips[transport.today_trips.length - 1];
  if (!latest) return "No trip running";
  if (latest.dropped_at) return `Dropped at ${timeLabel(latest.dropped_at)}`;
  if (latest.boarded_at) return `Boarded at ${timeLabel(latest.boarded_at)}`;
  if (latest.status === "STARTED") return `${latest.direction === "PICKUP" ? "Pickup" : "Drop"} trip on the way`;
  if (latest.status === "COMPLETED") return "Trip completed";
  if (latest.status === "CANCELLED") return "Trip cancelled";
  return "Trip not started";
}

function TransportCard({ transport: t }: { transport: ParentTransport }) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
            <Bus className="size-4" />
          </span>
          School bus
        </span>
        {t.assigned && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            {tripStatus(t)}
          </span>
        )}
      </div>

      {!t.assigned ? (
        <p className="mt-4 text-sm text-muted-foreground">Not using school transport.</p>
      ) : (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-muted/50 p-3">
              <dt className="text-muted-foreground">{t.route_name ?? "Route"}</dt>
              <dd className="mt-0.5 font-medium">{t.bus_number ?? "—"}</dd>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <dt className="text-muted-foreground">{t.pickup_stop?.name ?? "Pickup"}</dt>
              <dd className="mt-0.5 font-medium">
                {t.pickup_stop ? `Pickup ${formatTime(t.pickup_stop.pickup_time)}` : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-2.5">
              <InitialsAvatar name={t.driver_name ?? "Driver"} size="sm" />
              <div>
                <p className="text-sm font-medium">{t.driver_name ?? "Driver not assigned"}</p>
                <p className="text-2xs text-muted-foreground">Driver</p>
              </div>
            </div>
            {t.driver_phone ? (
              <a
                href={`tel:${t.driver_phone.replace(/\s/g, "")}`}
                aria-label={`Call ${t.driver_name ?? "driver"}`}
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <Phone />
              </a>
            ) : null}
          </div>
        </>
      )}

      <Link href="/parent/transport" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-3")}>
        Transport details
        <ArrowRight />
      </Link>
    </section>
  );
}

type CalendarDay = "present" | "late" | "partial" | "absent" | "leave" | "unmarked" | "upcoming";

const dayStyles: Record<CalendarDay, string> = {
  present: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  late: "bg-amber-400/25 text-amber-800 dark:text-amber-300",
  partial: "bg-orange-400/25 text-orange-800 dark:text-orange-300",
  absent: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  leave: "bg-muted text-muted-foreground",
  unmarked: "text-muted-foreground/60",
  upcoming: "text-muted-foreground/40",
};

const legend: Array<{ key: CalendarDay; label: string; dot: string }> = [
  { key: "present", label: "Present", dot: "bg-emerald-500" },
  { key: "late", label: "Late", dot: "bg-amber-400" },
  { key: "partial", label: "Partly absent", dot: "bg-orange-400" },
  { key: "absent", label: "Absent", dot: "bg-rose-500" },
  { key: "leave", label: "Leave", dot: "bg-muted-foreground/50" },
];

const toCalendarDay: Record<DayStatusValue, CalendarDay> = {
  PRESENT: "present",
  LATE: "late",
  PARTIAL: "partial",
  ABSENT: "absent",
  LEAVE: "leave",
};

function AttendanceCalendar({ data }: { data: ParentDashboardData }) {
  const [year, month] = data.month.split("-").map(Number) as [number, number];
  const monthIndex = month - 1;
  const today = data.date;

  const { cells, counts } = useMemo(() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    // Monday-first offset
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

    const result: Array<{ day: number; key: string; status: CalendarDay } | null> = Array.from(
      { length: offset },
      () => null,
    );
    const tally: Record<CalendarDay, number> = { present: 0, late: 0, partial: 0, absent: 0, leave: 0, unmarked: 0, upcoming: 0 };

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const marked = data.attendance_days[key];
      // Only days with a mark are coloured; nothing is assumed present.
      const status: CalendarDay = marked ? (toCalendarDay[marked] ?? "unmarked") : key > today ? "upcoming" : "unmarked";
      tally[status] += 1;
      result.push({ day, key, status });
    }

    return { cells: result, counts: tally };
  }, [data, year, month, monthIndex, today]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-2xs font-medium text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) =>
          cell ? (
            <span
              key={i}
              title={cell.status === "unmarked" ? "Not marked" : cell.status}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs font-medium tabular-nums",
                dayStyles[cell.status],
                cell.key === today && "ring-2 ring-foreground/70 ring-offset-1 ring-offset-card",
              )}
            >
              {cell.day}
            </span>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
        {legend.map((l) => (
          <span key={l.key} className="inline-flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", l.dot)} />
            {l.label}
            <span className="font-medium text-foreground tabular-nums">{counts[l.key]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RecentMessages({ tone: toneName }: { tone: Tone }) {
  const tone = toneStyles[toneName];
  const listQuery = useConversations("parent");
  const chats = (listQuery.data?.conversations ?? []).slice(0, 4);
  const unread = listQuery.data?.total_unread ?? 0;

  return (
    <SectionCard
      title="Messages"
      description={unread > 0 ? `${unread} unread` : "Your chats with teachers and the school office"}
      icon={MessageCircleHeart}
      iconClassName={cn(tone.soft, tone.text)}
      contentClassName="p-2"
      action={
        <Link href="/parent/communication" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Chats
          <ArrowRight />
        </Link>
      }
    >
      {listQuery.isLoading ? (
        <div className="space-y-2 p-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : chats.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          No messages yet. You can chat with your child&apos;s teachers and the school office from Communication.
        </p>
      ) : (
        <ul className="divide-y">
          {chats.map((c) => {
            const last = c.last_message;
            return (
              <li key={c.id}>
                <Link
                  href="/parent/communication"
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                >
                  <InitialsAvatar name={c.counterpart.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium">
                        {c.counterpart.name}
                        {c.counterpart.subtitle && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">{c.counterpart.subtitle}</span>
                        )}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="size-3" />
                        {listTimeLabel(c.last_message_at)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 line-clamp-2 text-sm leading-relaxed",
                        c.unread_count ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {last?.from_me && "You: "}
                      {last?.body}
                    </p>
                  </div>
                  {c.unread_count > 0 && <span className={cn("mt-2 size-2 shrink-0 rounded-full", tone.solid)} />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading dashboard">
      <Skeleton className="h-44 rounded-2xl" />
      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
