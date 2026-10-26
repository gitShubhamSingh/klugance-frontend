"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarCheck, CalendarX2, ClipboardList, History } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { useTeacherTimetable } from "@/features/teacher-timetable/hooks/use-teacher-timetable";
import { formatTime, toMinutes } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { useSaveRegister, useTodayRegisters } from "../hooks/use-teacher-attendance";
import { savedMarks } from "../lib/attendance-utils";
import { toApiStatus, type AttendanceRegister, type MarkStatus } from "../types/teacher-attendance";
import { AttendanceRecords } from "./attendance-records";
import { ClassSwitcher, type SwitcherItem } from "./class-switcher";
import { TakeAttendance } from "./take-attendance";

type Tab = "take" | "records";

/** Re-renders every 30s so "in class now" moves on its own. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function isRunning(register: AttendanceRegister, now: Date) {
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= toMinutes(register.start_time) && mins < toMinutes(register.end_time);
}

export function TeacherAttendancePage() {
  const now = useNow();
  const dateKey = toLocalDateKey(now);

  const registersQuery = useTodayRegisters(dateKey);
  const timetableQuery = useTeacherTimetable();
  const saveMutation = useSaveRegister();

  const registers = useMemo(() => registersQuery.data?.registers ?? [], [registersQuery.data]);
  const sections = timetableQuery.data?.sections ?? [];

  const [tab, setTab] = useState<Tab>("take");
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [registerId, setRegisterId] = useState<string | null>(null);
  const [recordsSectionId, setRecordsSectionId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, MarkStatus>>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Class-wise: pick a class (section), then one of its periods today.
  // Default to the period running now, else the first one not yet submitted.
  const defaultRegister =
    registers.find((r) => isRunning(r, now)) ?? registers.find((r) => !r.submitted_at) ?? registers[0];
  const activeSectionId = sectionId ?? defaultRegister?.section_id ?? null;
  const sectionRegisters = registers.filter((r) => r.section_id === activeSectionId);
  const register =
    sectionRegisters.find((r) => r.timetable_entry_id === registerId) ??
    sectionRegisters.find((r) => isRunning(r, now)) ??
    sectionRegisters.find((r) => !r.submitted_at) ??
    sectionRegisters[0];

  const recordsSection =
    sections.find((s) => s.id === recordsSectionId) ??
    sections.find((s) => s.id === register?.section_id) ??
    sections[0];

  const doneCount = registers.filter((r) => r.submitted_at).length;

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const marks = register ? (drafts[register.timetable_entry_id] ?? savedMarks(register)) : {};

  function updateDraft(next: Record<string, MarkStatus>) {
    if (!register) return;
    setSaveError(null);
    setDrafts((prev) => ({ ...prev, [register.timetable_entry_id]: next }));
  }

  function setMark(enrollmentId: string, status: MarkStatus) {
    updateDraft({ ...marks, [enrollmentId]: status });
  }

  function markAll(status: MarkStatus | null) {
    if (!register) return;
    const next: Record<string, MarkStatus> = {};
    register.students.forEach((s) => {
      // Keep leave as-is; overwrite the rest.
      if (marks[s.enrollment_id] === "leave") next[s.enrollment_id] = "leave";
      else if (status) next[s.enrollment_id] = status;
    });
    updateDraft(next);
  }

  function submit() {
    if (!register || saveMutation.isPending) return;

    const isUpdate = Boolean(register.submitted_at);
    const id = register.timetable_entry_id;
    setSaveError(null);

    saveMutation.mutate(
      {
        teacher_assignment_id: register.teacher_assignment_id,
        attendance_date: dateKey,
        period_number: register.period_number,
        attendances: register.students.map((s) => ({
          student_enrollment_id: s.enrollment_id,
          status: toApiStatus[marks[s.enrollment_id]!],
        })),
      },
      {
        onSuccess: () => {
          setDrafts((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          setEditing(null);
          toast.success(isUpdate ? "Attendance updated" : "Attendance submitted", {
            description: `${register.class_name} – ${register.section_name} · ${register.period_name} · ${today}`,
          });
        },
        onError: (error) => setSaveError(getErrorMessage(error)),
      },
    );
  }

  function changeRegister(id: string) {
    setRegisterId(id);
    setEditing(null);
    setSaveError(null);
  }

  function changeSection(id: string) {
    setSectionId(id);
    setRegisterId(null);
    setEditing(null);
    setSaveError(null);
  }

  const classItems: SwitcherItem[] = [...new Map(registers.map((r) => [r.section_id, r])).values()].map((first) => {
    const periods = registers.filter((r) => r.section_id === first.section_id);
    const done = periods.filter((r) => r.submitted_at).length;
    return {
      id: first.section_id,
      title: `${first.class_name.replace(/^Class\s+/i, "")} – ${first.section_name}`,
      subtitle: `${done}/${periods.length} ${periods.length === 1 ? "period" : "periods"} marked`,
      state: done === periods.length ? "done" : periods.some((r) => isRunning(r, now)) ? "now" : "pending",
    };
  });

  const periodItems: SwitcherItem[] = sectionRegisters.map((r) => ({
    id: r.timetable_entry_id,
    title: `${r.period_name} · ${r.subject_name}`,
    subtitle: `${formatTime(r.start_time)}${!r.is_my_period && r.subject_teacher_name ? ` · ${r.subject_teacher_name}` : ""}`,
    state: r.submitted_at ? "done" : isRunning(r, now) ? "now" : "pending",
  }));

  const sectionItems: SwitcherItem[] = sections.map((s) => ({
    id: s.id,
    title: s.shortName,
    subtitle: s.subjects,
  }));

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="mt-2 text-muted-foreground">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            {registers.length > 0 && (
              <div className="hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm sm:flex">
                <ClipboardList className="size-4 text-muted-foreground" />
                <span>
                  <span className="font-semibold tabular-nums">{doneCount}</span>
                  <span className="text-muted-foreground"> / {registers.length} periods marked today</span>
                </span>
              </div>
            )}

            <div role="tablist" aria-label="Attendance view" className="flex rounded-xl bg-muted p-1">
              <TabButton active={tab === "take"} onClick={() => setTab("take")} icon={CalendarCheck}>
                Take attendance
              </TabButton>
              <TabButton active={tab === "records"} onClick={() => setTab("records")} icon={History}>
                Records
              </TabButton>
            </div>
          </div>
        </div>

        {tab === "take" ? (
          registersQuery.isLoading ? (
            <div className="space-y-4" role="status" aria-label="Loading registers">
              <Skeleton className="h-12 w-2/3 rounded-xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          ) : registersQuery.isError ? (
            <ErrorState
              title="Unable to load today's classes"
              message={getErrorMessage(registersQuery.error)}
              onRetry={() => void registersQuery.refetch()}
            />
          ) : !register ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <CalendarX2 className="mx-auto size-7 text-muted-foreground" />
              <h2 className="mt-3 font-semibold">No classes on the timetable today</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Registers appear here for every period of the classes you teach. You can still review past attendance
                under Records.
              </p>
            </div>
          ) : (
            <>
              <ClassSwitcher items={classItems} value={register.section_id} onChange={changeSection} />
              {periodItems.length > 1 && (
                <ClassSwitcher
                  items={periodItems}
                  value={register.timetable_entry_id}
                  onChange={changeRegister}
                  label="Choose period"
                />
              )}
              <TakeAttendance
                key={register.timetable_entry_id}
                register={register}
                isNow={isRunning(register, now)}
                marks={marks}
                editing={editing === register.timetable_entry_id}
                saving={saveMutation.isPending}
                error={saveError}
                onMark={setMark}
                onMarkAll={markAll}
                onSubmit={submit}
                onEdit={() => setEditing(register.timetable_entry_id)}
              />
            </>
          )
        ) : timetableQuery.isLoading ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : timetableQuery.isError ? (
          <ErrorState
            title="Unable to load your classes"
            message={getErrorMessage(timetableQuery.error)}
            onRetry={() => void timetableQuery.refetch()}
          />
        ) : !recordsSection ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            You have no classes assigned yet.
          </div>
        ) : (
          <>
            <ClassSwitcher
              items={sectionItems}
              value={recordsSection.id}
              onChange={setRecordsSectionId}
              label="Choose section"
            />
            <AttendanceRecords
              key={recordsSection.id}
              sectionId={recordsSection.id}
              sectionLabel={recordsSection.name}
              currentMonth={dateKey.slice(0, 7)}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}

function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof History;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}
