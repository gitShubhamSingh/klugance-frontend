"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, LayoutGrid, Users, type LucideIcon } from "lucide-react";

import { useStudents } from "@/features/students/hooks/use-students";
import { useTeachers } from "@/features/teachers/hooks/use-teachers";

import type { SchoolDashboard } from "../types";

function activeSplit(list: { is_active: boolean }[] | undefined) {
  if (!list) return null;
  const active = list.filter((x) => x.is_active).length;
  return { active, inactive: list.length - active };
}

export function SummaryCards({ data }: { data: SchoolDashboard }) {
  const students = useStudents();
  const teachers = useTeachers();

  const studentSplit = activeSplit(students.data);
  const teacherSplit = activeSplit(teachers.data);
  const { total_students, total_teachers, total_classes, total_sections } = data.summary;

  const avgSections =
    total_classes > 0 ? Math.round((total_sections / total_classes) * 10) / 10 : 0;

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <SummaryCard
        href="/students"
        icon={GraduationCap}
        title="Students"
        value={total_students}
        hint={
          studentSplit
            ? `${studentSplit.active} active · ${studentSplit.inactive} inactive`
            : "In the current academic year"
        }
      />
      <SummaryCard
        href="/teachers"
        icon={Users}
        title="Teachers"
        value={total_teachers}
        hint={
          teacherSplit
            ? `${teacherSplit.active} active · ${teacherSplit.inactive} inactive`
            : "Teaching staff"
        }
      />
      <SummaryCard
        href="/academics/classes"
        icon={BookOpen}
        title="Classes"
        value={total_classes}
        hint={data.academic_year ? `In ${data.academic_year.name}` : "No academic year set"}
      />
      <SummaryCard
        href="/academics/sections"
        icon={LayoutGrid}
        title="Sections"
        value={total_sections}
        hint={total_classes > 0 ? `About ${avgSections} per class` : "Across all classes"}
      />
    </section>
  );
}

function SummaryCard({
  href,
  icon: Icon,
  title,
  value,
  hint,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  value: number;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="rounded-lg bg-muted p-2 transition-colors group-hover:bg-background">
          <Icon className="size-4 text-muted-foreground" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {value.toLocaleString("en-IN")}
      </p>
      <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}
