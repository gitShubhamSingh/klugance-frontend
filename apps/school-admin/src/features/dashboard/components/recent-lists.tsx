"use client";

import { UserPlus, Users } from "lucide-react";

import { useStudents } from "@/features/students/hooks/use-students";
import { useTeachers } from "@/features/teachers/hooks/use-teachers";
import { cn } from "@/lib/utils";

import { formatDate, fullName, initials, parseDate } from "../lib/dashboard-format";
import { DashboardPanel, PanelMessage, PanelSkeleton } from "./dashboard-panel";

const LIMIT = 5;

function byDateDesc<T>(list: T[], getDate: (x: T) => string | null | undefined) {
  return [...list]
    .filter((x) => parseDate(getDate(x)))
    .sort((a, b) => parseDate(getDate(b))!.getTime() - parseDate(getDate(a))!.getTime());
}

function PersonRow({
  name,
  meta,
  date,
  inactive,
}: {
  name: string;
  meta: string;
  date: string;
  inactive?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
        {initials(name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium">
          <span className="truncate">{name}</span>
          {inactive && (
            <span className="shrink-0 rounded-full bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
              Inactive
            </span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
    </li>
  );
}

export function RecentAdmissionsCard() {
  const students = useStudents();
  const recent = byDateDesc(students.data ?? [], (s) => s.admission_date).slice(0, LIMIT);

  return (
    <DashboardPanel
      title="Recent admissions"
      description="Latest students by admission date"
      icon={UserPlus}
      link={{ href: "/students", label: "Students" }}
    >
      {students.isPending ? (
        <PanelSkeleton />
      ) : students.isError ? (
        <PanelMessage title="Couldn't load students" />
      ) : recent.length === 0 ? (
        <PanelMessage title="No admissions recorded" description="Admission dates will appear here once added." />
      ) : (
        <ul className={cn("-my-2.5 divide-y")}>
          {recent.map((s) => (
            <PersonRow
              key={s.id}
              name={fullName(s)}
              meta={[
                s.admission_number,
                [s.class_name, s.section_name].filter(Boolean).join(" – ") || "No class yet",
              ].join(" · ")}
              date={formatDate(s.admission_date)}
              inactive={!s.is_active}
            />
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}

export function RecentTeachersCard() {
  const teachers = useTeachers();
  const recent = byDateDesc(teachers.data ?? [], (t) => t.joining_date ?? t.created_at).slice(0, LIMIT);

  return (
    <DashboardPanel
      title="Recently joined teachers"
      description="Latest by joining date"
      icon={Users}
      link={{ href: "/teachers", label: "Teachers" }}
    >
      {teachers.isPending ? (
        <PanelSkeleton />
      ) : teachers.isError ? (
        <PanelMessage title="Couldn't load teachers" />
      ) : recent.length === 0 ? (
        <PanelMessage
          title="No teachers yet"
          description="Teachers you add will appear here."
          action={{ href: "/teachers", label: "Add teachers" }}
        />
      ) : (
        <ul className="-my-2.5 divide-y">
          {recent.map((t) => (
            <PersonRow
              key={t.id}
              name={fullName(t)}
              meta={[t.employee_code, t.qualification].filter(Boolean).join(" · ")}
              date={formatDate(t.joining_date ?? t.created_at)}
              inactive={!t.is_active}
            />
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
