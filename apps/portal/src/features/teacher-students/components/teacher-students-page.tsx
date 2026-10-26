"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Download,
  Megaphone,
  Target,
  TriangleAlert,
  UserCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import {
  toLocalDateKey,
  useTeacherDashboard,
} from "@/features/dashboard/hooks/use-teacher-dashboard";
import { cn } from "@/lib/utils";

import { useTeacherStudents } from "../hooks/use-teacher-students";
import { average, formatPercent, getStudentFlag } from "../lib/student-insights";
import type { TeacherStudent } from "../types/teacher-students";
import { ClassContextCards } from "./class-context-cards";
import { SectionPicker } from "./section-picker";
import { StudentDetailSheet } from "./student-detail-sheet";
import { StudentInsightsPanel } from "./student-insights-panel";
import { StudentRoster } from "./student-roster";

const EMPTY_STUDENTS: TeacherStudent[] = [];

/** Re-renders every minute so "today" rolls over at midnight. */
function useToday() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function TeacherStudentsPage() {
  const now = useToday();
  const dateKey = toLocalDateKey(now);

  const studentsQuery = useTeacherStudents(dateKey);
  // Today's periods for the "now / next" cards (shared with the dashboard).
  const dashboardQuery = useTeacherDashboard(dateKey);

  const [sectionId, setSectionId] = useState<string>("all");
  const [selected, setSelected] = useState<TeacherStudent | null>(null);

  const sections = useMemo(() => studentsQuery.data?.sections ?? [], [studentsQuery.data]);
  const allStudents = studentsQuery.data?.students ?? EMPTY_STUDENTS;

  const section = sections.find((s) => s.id === sectionId);
  const students = useMemo(
    () =>
      sectionId === "all"
        ? allStudents
        : allStudents.filter((s) => s.sectionId === sectionId),
    [allStudents, sectionId],
  );

  const stats = useMemo(() => {
    const marked = students.filter((s) => s.presentToday !== null).length;
    const present = students.filter((s) => s.presentToday === true).length;
    const boys = students.filter((s) => s.gender === "M").length;
    const girls = students.filter((s) => s.gender === "F").length;
    return {
      total: students.length,
      boys,
      girls,
      marked,
      present,
      presentPct: marked ? Math.round((present / marked) * 100) : 0,
      avgScore: average(students.map((s) => s.avgScore)),
      attendance: average(students.map((s) => s.attendance)),
      attention: students.filter((s) => getStudentFlag(s) === "attention").length,
    };
  }, [students]);

  function selectSection(id: string) {
    setSectionId(id);
    document.getElementById("student-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const scopeLabel = section ? section.name : "All classes";

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
            <p className="mt-2 text-muted-foreground">
              {studentsQuery.data
                ? `Everyone you teach across ${sections.length} ${sections.length === 1 ? "section" : "sections"}, plus who needs you today.`
                : "Everyone you teach, plus who needs you today."}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Export is a placeholder — wire it to the export API later. */}
            <Button variant="outline" type="button">
              <Download />
              Export
            </Button>
            <Link href="/teacher/communication" className={buttonVariants()}>
              <Megaphone />
              Message parents
            </Link>
          </div>
        </div>

        {studentsQuery.isLoading ? (
          <StudentsSkeleton />
        ) : studentsQuery.isError || !studentsQuery.data ? (
          <ErrorState
            message={getErrorMessage(studentsQuery.error)}
            onRetry={() => void studentsQuery.refetch()}
          />
        ) : sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <UsersRound className="mx-auto size-7 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">No classes assigned yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Once the school assigns you subjects and sections, your students appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              <SummaryCard
                icon={UsersRound}
                label={sectionId === "all" ? "Total students" : `Students in ${section?.shortName}`}
                value={`${stats.total}`}
                hint={
                  stats.boys + stats.girls > 0
                    ? `${stats.boys} boys · ${stats.girls} girls`
                    : `${stats.total === 1 ? "1 student" : `${stats.total} students`} enrolled`
                }
              />
              <SummaryCard
                icon={UserCheck}
                label="Present today"
                value={stats.marked ? `${stats.present}` : "—"}
                hint={
                  stats.marked
                    ? `${stats.presentPct}% of ${stats.marked} marked · avg. attendance ${formatPercent(stats.attendance)}`
                    : `Not marked yet today · avg. attendance ${formatPercent(stats.attendance)}`
                }
                progress={stats.marked ? stats.presentPct : undefined}
              />
              <SummaryCard
                icon={Target}
                label="Average score"
                value={formatPercent(stats.avgScore)}
                hint={stats.avgScore === null ? "No marks entered yet" : "Across your subjects' exams"}
              />
              <SummaryCard
                icon={TriangleAlert}
                label="Need attention"
                value={`${stats.attention}`}
                hint="Low attendance, scores or homework"
                tone="warn"
              />
            </section>

            {/* Now & next */}
            <ClassContextCards
              sections={sections}
              students={allStudents}
              schedule={dashboardQuery.data?.today_schedule ?? []}
              now={now}
              onSelectSection={selectSection}
              onSelectStudent={setSelected}
            />

            {/* Class-wise */}
            <SectionPicker
              sections={sections}
              students={allStudents}
              value={sectionId}
              onChange={setSectionId}
            />

            {/* Roster + insights */}
            <div id="student-list" className="grid scroll-mt-20 gap-6 xl:grid-cols-3">
              <StudentRoster
                key={sectionId}
                students={students}
                sections={sections}
                sectionLabel={scopeLabel}
                showClassColumn={sectionId === "all"}
                onSelectStudent={setSelected}
              />
              <StudentInsightsPanel
                students={students}
                sections={sections}
                showClass={sectionId === "all"}
                onSelectStudent={setSelected}
              />
            </div>
          </>
        )}
      </div>

      <StudentDetailSheet
        student={selected}
        sections={sections}
        onClose={() => setSelected(null)}
      />
    </PageContainer>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  progress,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  progress?: number;
  tone?: "warn";
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-xl bg-muted",
            tone === "warn" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function StudentsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading students">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <h2 className="mt-3 font-semibold">Unable to load your students</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
