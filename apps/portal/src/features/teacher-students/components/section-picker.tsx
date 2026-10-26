"use client";

import { LayoutGrid } from "lucide-react";

import { toneStyles } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import {
  attendanceBar,
  average,
  formatPercent,
  getSectionSummary,
} from "../lib/student-insights";
import type { ClassSection, TeacherStudent } from "../types/teacher-students";

type Props = {
  sections: ClassSection[];
  students: TeacherStudent[];
  value: string;
  onChange: (sectionId: string) => void;
};

export function SectionPicker({ sections, students, value, onChange }: Props) {
  const allAvg = average(students.map((s) => s.avgScore));
  const allAttendance = average(students.map((s) => s.attendance));

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Class-wise students</h2>
          <p className="text-sm text-muted-foreground">
            Pick a class to filter everything below
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filter by class"
        className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0"
      >
        <SectionTile
          active={value === "all"}
          onClick={() => onChange("all")}
          icon={<LayoutGrid className="size-4" />}
          iconClassName="bg-muted text-foreground"
          title="All classes"
          subtitle={`${sections.length} ${sections.length === 1 ? "section" : "sections"}`}
          count={students.length}
          avgScore={allAvg}
          attendance={allAttendance}
        />

        {sections.map((section) => {
          const summary = getSectionSummary(section, students);
          const tone = toneStyles[section.tone];
          return (
            <SectionTile
              key={section.id}
              active={value === section.id}
              onClick={() => onChange(section.id)}
              icon={<span className="text-2xs font-bold">{section.shortName.replace(" – ", "")}</span>}
              iconClassName={cn(tone.soft, tone.text)}
              title={section.name}
              subtitle={section.subject}
              count={summary.count}
              avgScore={summary.avgScore}
              attendance={summary.attendance}
            />
          );
        })}
      </div>
    </section>
  );
}

function SectionTile({
  active,
  onClick,
  icon,
  iconClassName,
  title,
  subtitle,
  count,
  avgScore,
  attendance,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  subtitle: string;
  count: number;
  avgScore: number | null;
  attendance: number | null;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative w-44 shrink-0 snap-start rounded-2xl border bg-card p-4 text-left transition-all lg:w-auto",
        active
          ? "border-foreground/80 shadow-sm ring-1 ring-foreground/80"
          : "hover:border-foreground/20 hover:bg-muted/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-xl", iconClassName)}>
          {icon}
        </span>
      </div>
      <p className="mt-3 truncate text-sm font-semibold">{title}</p>
      <p className="truncate text-xs text-muted-foreground">{subtitle}</p>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{count}</span>
        <span className="text-xs text-muted-foreground">
          Avg <span className="font-medium text-foreground tabular-nums">{formatPercent(avgScore)}</span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", attendanceBar(attendance))}
            style={{ width: `${attendance ?? 0}%` }}
          />
        </div>
        <span className="text-2xs text-muted-foreground tabular-nums">{formatPercent(attendance)}</span>
      </div>
    </button>
  );
}
