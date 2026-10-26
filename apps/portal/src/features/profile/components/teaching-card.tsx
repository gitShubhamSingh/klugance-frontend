"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  CalendarPlus,
  GraduationCap,
  School,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { toneStyles } from "@/features/dashboard/lib/tones";
import { SettingsCard } from "@/features/account-settings/components/settings-card";
import { useTeacherTimetable } from "@/features/teacher-timetable/hooks/use-teacher-timetable";
import { cn } from "@/lib/utils";

import { useTeacherProfile } from "../hooks/use-teacher-profile";

function formatJoiningDate(value: string | null) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TeachingCard() {
  const timetableQuery = useTeacherTimetable();
  const profileQuery = useTeacherProfile();

  const sections = timetableQuery.data?.sections ?? [];
  const subjects = [...new Set(sections.flatMap((s) => s.subjects.split(", ")).filter((s) => s && s !== "—"))];
  const totalStudents = sections.reduce((sum, s) => sum + s.studentCount, 0);
  const weeklyPeriods = sections.reduce((sum, s) => sum + s.periodsPerWeek, 0);

  const stats = [
    { label: "Subjects", value: subjects.length, icon: BookOpen },
    { label: "Classes", value: sections.length, icon: School },
    { label: "Students", value: totalStudents, icon: GraduationCap },
    { label: "Periods / week", value: weeklyPeriods, icon: CalendarDays },
  ];

  const profile = profileQuery.data;

  return (
    <SettingsCard
      id="teaching"
      title="Teaching"
      description={`Your subjects and the classes assigned to you${
        timetableQuery.data?.academicYearName ? ` in ${timetableQuery.data.academicYearName}` : " this term"
      }.`}
    >
      {profile && (
        <dl className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Fact icon={BadgeCheck} label="Employee ID" value={profile.employee_code} />
          <Fact icon={GraduationCap} label="Qualification" value={profile.qualification || "—"} />
          <Fact icon={CalendarPlus} label="Joined" value={formatJoiningDate(profile.joining_date)} />
          <Fact
            icon={Briefcase}
            label="Experience"
            value={
              profile.experience_years === null
                ? "—"
                : `${profile.experience_years} ${profile.experience_years === 1 ? "year" : "years"}`
            }
          />
        </dl>
      )}

      {timetableQuery.isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading teaching details">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      ) : timetableQuery.isError ? (
        <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          Your classes could not be loaded right now. Please try again later.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/40 p-3">
                <s.icon className="size-4 text-muted-foreground" />
                <p className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {subjects.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <span key={subject} className="rounded-full border px-3 py-1 text-sm font-medium">
                  {subject}
                </span>
              ))}
            </div>
          )}

          {sections.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              No classes are assigned to you yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y rounded-xl border">
              {sections.map((section) => {
                const tone = toneStyles[section.tone];
                return (
                  <li key={section.id} className="flex items-center gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                        tone.soft,
                        tone.text,
                      )}
                    >
                      {section.shortName.replace(/\s/g, "")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{section.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{section.subjects}</p>
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {section.periodsPerWeek} {section.periodsPerWeek === 1 ? "period" : "periods"}/week
                    </span>
                    <span className="text-sm tabular-nums text-muted-foreground">{section.studentCount}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href="/teacher/timetable" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          View timetable <ArrowRight className="size-3.5" />
        </Link>
        <Link href="/teacher/students" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          My students <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </SettingsCard>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
