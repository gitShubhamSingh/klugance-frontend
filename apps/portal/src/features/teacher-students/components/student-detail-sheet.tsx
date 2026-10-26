"use client";

import Link from "next/link";
import { CalendarCheck, MessageSquareText, Phone, Target, BookOpenCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { chatHref } from "@/features/communication";
import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import { toneStyles } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import {
  attendanceBar,
  flagLabels,
  formatPercent,
  flagStyles,
  getAttentionReason,
  getStudentFlag,
  scoreTone,
} from "../lib/student-insights";
import type { ClassSection, TeacherStudent } from "../types/teacher-students";

type Props = {
  student: TeacherStudent | null;
  sections: ClassSection[];
  onClose: () => void;
};

export function StudentDetailSheet({ student, sections, onClose }: Props) {
  return (
    <Sheet
      open={Boolean(student)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {student && (
          <StudentDetail
            student={student}
            section={sections.find((x) => x.id === student.sectionId)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function StudentDetail({
  student: s,
  section,
}: {
  student: TeacherStudent;
  section: ClassSection | undefined;
}) {
  const tone = toneStyles[section?.tone ?? "indigo"];
  const flag = getStudentFlag(s);
  const maxScore = Math.max(...s.scores.map((t) => t.score), 100);

  return (
    <>
      <SheetHeader className="border-b p-6">
        <div className="flex items-center gap-4">
          <InitialsAvatar name={s.name} tone={section?.tone} size="lg" />
          <div className="min-w-0">
            <SheetTitle className="truncate text-lg font-semibold">{s.name}</SheetTitle>
            <SheetDescription>
              {section?.name} · Roll {s.rollNo} · Adm. {s.admissionNumber}
            </SheetDescription>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={cn("rounded-full px-2 py-0.5 text-2xs font-medium", flagStyles[flag])}>
                {flagLabels[flag]}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-2xs font-medium",
                  s.presentToday === null
                    ? "bg-muted text-muted-foreground"
                    : s.presentToday
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                )}
              >
                {s.presentToday === null
                  ? "Not marked today"
                  : s.presentToday
                    ? "Present today"
                    : "Absent today"}
              </span>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-6 p-6">
        {flag === "attention" && (
          <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
            {getAttentionReason(s)}
          </p>
        )}

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={CalendarCheck} label="Attendance" value={formatPercent(s.attendance)}>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full", attendanceBar(s.attendance))} style={{ width: `${s.attendance ?? 0}%` }} />
            </div>
          </Stat>
          <Stat icon={Target} label="Avg. score" value={formatPercent(s.avgScore)} valueClassName={scoreTone(s.avgScore)} />
          <Stat icon={BookOpenCheck} label="Homework" value={formatPercent(s.homeworkRate)} />
        </div>

        {/* Test history */}
        <div>
          <p className="text-sm font-medium">
            {section?.subject} test history
          </p>
          {s.scores.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
              No exam marks entered yet.
            </p>
          ) : (
            <div className="mt-3 flex h-32 items-end gap-3 rounded-xl border p-3 pb-2">
              {s.scores.map((t, i) => {
                const isLast = i === s.scores.length - 1;
                return (
                  <div key={`${t.test}-${i}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-2xs font-medium tabular-nums">{t.score}</span>
                    <div
                      className={cn("w-full max-w-10 rounded-t-md", isLast ? tone.solid : "bg-muted-foreground/20")}
                      style={{ height: `${(t.score / maxScore) * 70}%` }}
                    />
                    <span className="text-3xs text-muted-foreground">{t.test}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Parent contact */}
        <div>
          <p className="text-sm font-medium">Parent / guardian</p>
          {s.parentName && s.parentPhone ? (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border p-3">
              <div className="flex min-w-0 items-center gap-3">
                <InitialsAvatar name={s.parentName} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.parentName}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{s.parentPhone}</p>
                </div>
              </div>
              <a
                href={`tel:${s.parentPhone.replace(/\s/g, "")}`}
                aria-label={`Call ${s.parentName}`}
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <Phone />
              </a>
            </div>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
              No parent or guardian linked yet.
            </p>
          )}
        </div>
      </div>

      <SheetFooter className="grid grid-cols-2 gap-2 border-t p-4">
        <Link
          href={chatHref("/teacher/communication", { role: "STUDENT", user_id: s.userId })}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          <MessageSquareText />
          Message student
        </Link>
        {s.parentUserId ? (
          <Link
            href={chatHref("/teacher/communication", { role: "PARENT", user_id: s.parentUserId })}
            className={cn(buttonVariants(), "w-full")}
          >
            <MessageSquareText />
            Message parent
          </Link>
        ) : (
          <span className={cn(buttonVariants(), "pointer-events-none w-full opacity-50")} aria-disabled>
            <MessageSquareText />
            No parent linked
          </span>
        )}
      </SheetFooter>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  valueClassName,
  children,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  valueClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-3">
      <Icon className="size-4 text-muted-foreground" />
      <p className={cn("mt-2 text-lg font-semibold tabular-nums", valueClassName)}>{value}</p>
      <p className="text-2xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
