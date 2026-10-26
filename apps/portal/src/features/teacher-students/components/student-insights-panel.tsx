"use client";

import { Cake, Trophy, TriangleAlert } from "lucide-react";

import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import { SectionCard } from "@/features/dashboard/components/shared/section-card";
import { cn } from "@/lib/utils";

import { getAttentionReason, getStudentFlag } from "../lib/student-insights";
import type { ClassSection, TeacherStudent } from "../types/teacher-students";

type Props = {
  students: TeacherStudent[];
  sections: ClassSection[];
  showClass: boolean;
  onSelectStudent: (student: TeacherStudent) => void;
};

const medalStyles = [
  "bg-primary text-primary-foreground",
  "bg-muted-foreground/30 text-foreground",
  "bg-muted text-foreground",
];

export function StudentInsightsPanel({ students, sections, showClass, onSelectStudent }: Props) {
  const sectionNames = new Map(sections.map((s) => [s.id, s.shortName]));

  // Only students with marks can rank; no data yet is not "top".
  const top = students
    .filter((s): s is TeacherStudent & { avgScore: number } => s.avgScore !== null)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);
  const attention = students
    .filter((s) => getStudentFlag(s) === "attention")
    .sort(
      (a, b) =>
        (a.trend ?? 0) - (b.trend ?? 0) ||
        (a.attendance ?? 100) - (b.attendance ?? 100),
    )
    .slice(0, 5);
  const birthdays = students.filter((s) => s.birthday);

  const meta = (s: TeacherStudent) =>
    showClass ? `Class ${sectionNames.get(s.sectionId)}` : `Roll ${s.rollNo}`;

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Top performers"
        description="Highest average score this term"
        icon={Trophy}
        iconClassName="bg-muted text-foreground"
        contentClassName="p-2"
      >
        {top.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Rankings appear once exam marks are entered.
          </p>
        ) : (
        <ol className="space-y-0.5">
          {top.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelectStudent(s)}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-2xs font-bold",
                    medalStyles[i] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <InitialsAvatar name={s.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{meta(s)}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
                  {s.avgScore}%
                </span>
              </button>
            </li>
          ))}
        </ol>
        )}
      </SectionCard>

      <SectionCard
        title="Needs attention"
        description="Attendance, scores or homework slipping"
        icon={TriangleAlert}
        iconClassName="bg-muted text-foreground"
        contentClassName="p-2"
      >
        {attention.length > 0 ? (
          <ul className="space-y-0.5">
            {attention.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelectStudent(s)}
                  className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <InitialsAvatar name={s.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {s.name}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">{meta(s)}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">
                      {getAttentionReason(s)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Everyone is on track 👏
          </p>
        )}
      </SectionCard>

      {birthdays.length > 0 && (
        <section className="rounded-2xl border border-dashed bg-card p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Cake className="size-4 text-muted-foreground" />
            Birthdays this week
          </p>
          <ul className="mt-3 space-y-2">
            {birthdays.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5 text-sm">
                <InitialsAvatar name={s.name} size="sm" className="size-7 text-3xs" />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {s.birthday} · {sectionNames.get(s.sectionId)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
