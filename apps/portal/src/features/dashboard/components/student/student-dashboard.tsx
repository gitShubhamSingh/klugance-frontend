"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import type { CurrentUser } from "@/core/auth/types/auth.types";
import { LoadErrorState, childClassLabel } from "@/features/parent-children";
import { useStudentDashboard } from "@/features/student/hooks/use-student";
import {
  dueLabel,
  formatPercent,
  isHandedIn,
  submissionLabels,
  submissionStyles,
} from "@/features/student/lib/student-utils";
import type { StudentDashboard as StudentDashboardData, StudentHomeworkItem } from "@/features/student/types/student";
import { formatTime, toMinutes } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { toLocalDateKey } from "../../hooks/use-teacher-dashboard";
import { formatToday, getDisplayName } from "../../lib/dashboard-utils";
import { toneStyles, type Tone } from "../../lib/tones";
import type { AttendanceStatusValue, ParentPeriod } from "../../types/parent-dashboard";
import { chartTooltipLabelStyle, chartTooltipStyle } from "../shared/chart-tooltip";
import { SectionCard } from "../shared/section-card";

type Props = {
  user: CurrentUser;
};

type HomeworkFilter = "all" | "todo" | "submitted";

const homeworkFilters: Array<{ value: HomeworkFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "todo", label: "To do" },
  { value: "submitted", label: "Submitted" },
];

const SUBJECT_TONES: Tone[] = ["blue", "rose", "emerald", "amber", "violet", "cyan", "orange", "indigo"];

/** Same subject, same colour, across the dashboard. */
function subjectTone(subject: string): Tone {
  let hash = 0;
  for (const ch of subject) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return SUBJECT_TONES[hash % SUBJECT_TONES.length]!;
}

/** Re-renders every 30s so today's classes move on their own. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function classState(period: ParentPeriod, now: Date) {
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins >= toMinutes(period.end_time)) return "done";
  if (mins >= toMinutes(period.start_time)) return "live";
  return "upcoming";
}

export function StudentDashboard({ user }: Props) {
  const now = useNow();
  const dateKey = toLocalDateKey(now);
  const dashboardQuery = useStudentDashboard(dateKey);

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {dashboardQuery.isLoading ? (
          <div className="space-y-6" role="status" aria-label="Loading dashboard">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <div className="grid gap-6 xl:grid-cols-3">
              <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        ) : dashboardQuery.isError || !dashboardQuery.data ? (
          <LoadErrorState
            title="Unable to load your dashboard"
            message={getErrorMessage(dashboardQuery.error)}
            onRetry={() => void dashboardQuery.refetch()}
          />
        ) : (
          <DashboardBody data={dashboardQuery.data} name={getDisplayName(user)} now={now} />
        )}
      </div>
    </PageContainer>
  );
}

function DashboardBody({ data, name, now }: { data: StudentDashboardData; name: string; now: Date }) {
  const student = data.student;
  const liveClass = data.today_schedule.find((p) => classState(p, now) === "live");
  const doneCount = data.today_schedule.filter((p) => classState(p, now) === "done").length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                {childClassLabel(student)}
                {student.roll_number && ` · Roll ${student.roll_number}`}
              </span>
              {student.class_teachers.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <UserRound className="size-3.5" />
                  {student.class_teachers.join(", ")}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Hey {name}, ready to shine? 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {liveClass ? (
                <>
                  <span className="font-semibold text-foreground">{liveClass.subject_name}</span> is happening right
                  now{liveClass.teacher_name && ` with ${liveClass.teacher_name}`}.
                </>
              ) : (
                formatToday(now)
              )}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeroStat
              icon={<CalendarCheck className="size-5 text-muted-foreground" />}
              value={formatPercent(data.attendance_percent)}
              label="Attendance"
              highlight
            />
            <HeroStat
              icon={<Target className="size-5 text-muted-foreground" />}
              value={formatPercent(data.avg_score_percent)}
              label="Avg. score"
            />
            <HeroStat
              icon={<BookOpen className="size-5 text-muted-foreground" />}
              value={`${data.homework_summary.to_do}`}
              label="Homework to do"
            />
          </div>
        </div>
      </section>

      {/* ── Today's classes strip ────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Today&apos;s classes</h2>
            <p className="text-sm text-muted-foreground">
              {data.today_schedule.length === 0
                ? "No classes on the timetable today"
                : `${doneCount} of ${data.today_schedule.length} done`}
            </p>
          </div>
          <Link href="/student/timetable" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Timetable
            <ArrowRight />
          </Link>
        </div>

        {data.today_schedule.length > 0 && (
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {data.today_schedule.map((period, i) => (
              <ClassTile
                key={`${period.start_time}-${i}`}
                period={period}
                state={classState(period, now)}
                mark={data.today_periods.find((m) => m.start_time === period.start_time)?.status ?? null}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Homework + attendance ────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        <HomeworkBoard data={data} />

        <SectionCard title="My attendance" description="This year" icon={CalendarCheck} iconClassName="bg-muted text-foreground">
          <div className="flex flex-col items-center">
            <AttendanceRing value={data.attendance_percent} />

            <div className="mt-6 grid w-full grid-cols-7 gap-1.5">
              {data.week.map((d) => {
                const isToday = d.date === data.date;
                const future = d.date > data.date;
                const label = new Date(`${d.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" });
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1.5">
                    <span
                      title={d.status ?? (future ? "Upcoming" : "Not marked")}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl text-xs font-semibold",
                        d.status === "PRESENT" && "bg-emerald-500 text-white",
                        d.status === "LATE" && "bg-amber-400 text-white",
                        d.status === "PARTIAL" && "bg-orange-400 text-white",
                        d.status === "ABSENT" && "bg-rose-500 text-white",
                        d.status === "LEAVE" && "bg-muted-foreground/40 text-white",
                        !d.status && isToday && "border-2 border-dashed border-emerald-500 text-emerald-700 dark:text-emerald-300",
                        !d.status && !isToday && "bg-muted text-muted-foreground",
                      )}
                    >
                      {d.status === "PRESENT" ? <CheckCircle2 className="size-4" /> : label[0]}
                    </span>
                    <span className="text-2xs text-muted-foreground">{label}</span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/student/attendance"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-4")}
            >
              Full attendance record
              <ArrowRight />
            </Link>
          </div>
        </SectionCard>
      </div>

      {/* ── Performance + exams ──────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        <SubjectScores data={data} />

        <SectionCard
          title="Exam countdown"
          description="Plan your revision"
          icon={Clock3}
          iconClassName="bg-muted text-foreground"
          action={
            <Link href="/student/exams" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              All
              <ArrowRight />
            </Link>
          }
        >
          {data.upcoming_exams.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No exams scheduled yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.upcoming_exams.map((exam) => {
                const tone = toneStyles[subjectTone(exam.subject_name)];
                return (
                  <li key={exam.exam_subject_id} className="flex items-center gap-4 rounded-2xl border p-3">
                    <div
                      className={cn(
                        "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl",
                        tone.soft,
                        tone.text,
                      )}
                    >
                      <span className="text-xl leading-none font-bold tabular-nums">{exam.days_left}</span>
                      <span className="mt-0.5 text-3xs font-medium uppercase">{exam.days_left === 1 ? "day" : "days"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{exam.exam_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {exam.subject_name} ·{" "}
                        {new Date(`${exam.exam_date}T00:00:00`).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="mt-1 truncate text-xs text-foreground/70">
                        Max {exam.max_marks} · Pass {exam.pass_marks}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function HeroStat({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border p-3 text-center sm:p-4",
        highlight ? "bg-muted/60" : "bg-card",
      )}
    >
      {icon}
      <span className="mt-2 text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-2xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

const markLabels: Record<AttendanceStatusValue, { label: string; className: string }> = {
  PRESENT: { label: "Present", className: "text-emerald-700 dark:text-emerald-400" },
  LATE: { label: "Late", className: "text-amber-700 dark:text-amber-400" },
  HALF_DAY: { label: "Half day", className: "text-amber-700 dark:text-amber-400" },
  ABSENT: { label: "Absent", className: "text-rose-600 dark:text-rose-400" },
  LEAVE: { label: "Leave", className: "text-muted-foreground" },
};

function ClassTile({
  period,
  state,
  mark,
}: {
  period: ParentPeriod;
  state: "done" | "live" | "upcoming";
  mark: AttendanceStatusValue | null;
}) {
  const tone = toneStyles[subjectTone(period.subject_name)];
  const isLive = state === "live";
  const isDone = state === "done";

  return (
    <div
      className={cn(
        "relative w-40 shrink-0 snap-start overflow-hidden rounded-2xl border bg-card p-4 transition-transform hover:-translate-y-0.5",
        isLive && ["w-52 border-2", tone.border],
        isDone && "opacity-60",
      )}
    >
      {isLive && <div aria-hidden className={cn("absolute inset-x-0 top-0 h-1", tone.solid)} />}
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-xl", tone.soft, tone.text)}>
          <BookOpen className="size-4.5" />
        </span>
        {isLive ? (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold", tone.soft, tone.text)}>
            <span className={cn("size-1.5 animate-pulse rounded-full", tone.solid)} />
            Now
          </span>
        ) : isDone ? (
          <CheckCircle2 className="size-4 text-emerald-600" />
        ) : (
          <span className="text-xs font-medium tabular-nums text-muted-foreground">{formatTime(period.start_time)}</span>
        )}
      </div>
      <p className="mt-3 truncate font-semibold">{period.subject_name}</p>
      <p className="truncate text-xs text-muted-foreground">{period.teacher_name ?? "—"}</p>
      <p className="mt-2 text-2xs text-muted-foreground tabular-nums">
        {period.period_name} · {formatTime(period.start_time)} – {formatTime(period.end_time)}
      </p>
      {mark && markLabels[mark] && (
        <p className={cn("mt-1 text-2xs font-semibold", markLabels[mark].className)}>{markLabels[mark].label}</p>
      )}
    </div>
  );
}

function HomeworkBoard({ data }: { data: StudentDashboardData }) {
  const [filter, setFilter] = useState<HomeworkFilter>("all");

  const items = useMemo(() => {
    if (filter === "todo") return data.homework.filter((h) => !isHandedIn(h));
    if (filter === "submitted") return data.homework.filter(isHandedIn);
    return data.homework;
  }, [data.homework, filter]);

  const pending = data.homework_summary.to_do;

  return (
    <SectionCard
      className="xl:col-span-2"
      title="Homework"
      description={pending > 0 ? `${pending} ${pending === 1 ? "assignment" : "assignments"} waiting for you` : "You're all caught up"}
      icon={BookOpen}
      iconClassName="bg-muted text-foreground"
      action={
        <div className="flex rounded-full bg-muted p-1">
          {homeworkFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === f.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((hw) => (
          <HomeworkTile key={hw.id} hw={hw} today={data.date} />
        ))}
      </ul>
      {items.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">Nothing here — enjoy your free time! 🎉</p>
      )}
      {data.homework_summary.total > data.homework.length && (
        <Link href="/student/homework" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-3")}>
          All homework
          <ArrowRight />
        </Link>
      )}
    </SectionCard>
  );
}

function HomeworkTile({ hw, today }: { hw: StudentHomeworkItem; today: string }) {
  const tone = toneStyles[subjectTone(hw.subject_name)];
  const submitted = isHandedIn(hw);
  const urgent = !submitted && (hw.is_overdue || hw.due_date <= today);

  return (
    <li className="relative overflow-hidden rounded-2xl border bg-card p-4 pl-5 transition-shadow hover:shadow-md">
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", tone.solid)} />
      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-xs font-semibold", tone.text)}>{hw.subject_name}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-2xs font-medium", submissionStyles[hw.submission_status])}>
          {submissionLabels[hw.submission_status]}
        </span>
      </div>
      <p className={cn("mt-2 text-sm font-medium", submitted && "text-muted-foreground")}>{hw.title}</p>
      <p
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 text-xs",
          urgent ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
        )}
      >
        {submitted ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}
        {submitted
          ? hw.marks !== null
            ? `Marks ${hw.marks}/${hw.max_marks}`
            : "Handed in"
          : dueLabel(hw, today)}
      </p>
    </li>
  );
}

function SubjectScores({ data }: { data: StudentDashboardData }) {
  const scores = data.subject_scores.map((s) => ({
    subject: s.subject_name,
    score: Math.round(s.score_percent),
    classAvg: s.section_average_percent === null ? null : Math.round(s.section_average_percent),
  }));

  return (
    <SectionCard
      className="xl:col-span-2"
      title="My subject superpowers"
      description="Your published exam scores compared with your section"
      icon={Sparkles}
      iconClassName="bg-muted text-foreground"
      action={
        scores.length > 0 ? (
          <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" />
              You
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-muted-foreground/40" />
              Section avg.
            </span>
          </div>
        ) : undefined
      }
    >
      {scores.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Your scores appear here once exam results are published.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
          {/* A radar needs 3+ axes; fewer subjects only show the list. */}
          {scores.length >= 3 ? (
            <div className="h-72 text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={scores} outerRadius="75%">
                  <PolarGrid stroke="currentColor" strokeOpacity={0.15} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                  <Radar
                    name="Section avg."
                    dataKey="classAvg"
                    stroke="var(--muted-foreground)"
                    fill="var(--muted-foreground)"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="You"
                    dataKey="score"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          <ul className="space-y-3">
            {[...scores]
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map((s, i) => {
                const diff = s.classAvg === null ? null : s.score - s.classAvg;
                return (
                  <li key={s.subject}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {i === 0 && scores.length > 1 && "🏆 "}
                        {s.subject}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {s.score}
                        <span className="text-xs">/100</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                    </div>
                    {diff !== null && (
                      <p
                        className={cn(
                          "mt-1 text-2xs",
                          diff >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground",
                        )}
                      >
                        {diff === 0
                          ? "Same as section average"
                          : `${diff > 0 ? "+" : ""}${diff} ${diff > 0 ? "above" : "vs"} section average`}
                      </p>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}

function AttendanceRing({ value }: { value: number | null }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (value ?? 0) / 100);

  return (
    <div className="relative size-44">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="14" className="text-muted" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight tabular-nums">{formatPercent(value)}</span>
        <span className="text-xs text-muted-foreground">{value === null ? "not marked yet" : "present"}</span>
      </div>
    </div>
  );
}
