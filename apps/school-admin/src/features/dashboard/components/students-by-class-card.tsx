"use client";

import { useMemo } from "react";
import { GraduationCap } from "lucide-react";

import type { SchoolClass } from "@/features/classes/types";
import { useStudents } from "@/features/students/hooks/use-students";
import { cn } from "@/lib/utils";

import { DashboardPanel, PanelMessage, PanelSkeleton } from "./dashboard-panel";

const UNASSIGNED = "Not assigned to a class";

const genderLabels: Record<string, string> = {
  MALE: "Boys",
  FEMALE: "Girls",
  OTHER: "Other",
};

export function StudentsByClassCard({ classes }: { classes?: SchoolClass[] }) {
  const students = useStudents();

  const { rows, genders, total } = useMemo(() => {
    const list = students.data ?? [];
    const byClass = new Map<string, number>();
    const byGender = new Map<string, number>();

    list.forEach((s) => {
      const key = s.class_name?.trim() || UNASSIGNED;
      byClass.set(key, (byClass.get(key) ?? 0) + 1);
      if (s.gender) {
        const g = s.gender.toUpperCase();
        byGender.set(g, (byGender.get(g) ?? 0) + 1);
      }
    });

    // Follow the school's class order when we know it; unassigned goes last.
    const order = new Map((classes ?? []).map((c) => [c.name, c.display_order]));
    const sorted = [...byClass.entries()].sort(([a], [b]) => {
      if (a === UNASSIGNED) return 1;
      if (b === UNASSIGNED) return -1;
      const oa = order.get(a);
      const ob = order.get(b);
      if (oa !== undefined && ob !== undefined) return oa - ob;
      return a.localeCompare(b, undefined, { numeric: true });
    });

    return { rows: sorted, genders: [...byGender.entries()], total: list.length };
  }, [students.data, classes]);

  const max = Math.max(1, ...rows.map(([, n]) => n));

  return (
    <DashboardPanel
      title="Students by class"
      description={total ? `${total} students` : "Enrolment across classes"}
      icon={GraduationCap}
      link={{ href: "/students", label: "View all" }}
    >
      {students.isPending ? (
        <PanelSkeleton rows={5} />
      ) : students.isError ? (
        <PanelMessage title="Couldn't load students" description="Please try again in a moment." />
      ) : total === 0 ? (
        <PanelMessage
          title="No students yet"
          description="Students you add will show up here by class."
          action={{ href: "/students", label: "Add students" }}
        />
      ) : (
        <div className="space-y-4">
          {genders.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genders.map(([g, n]) => (
                <span key={g} className="rounded-full border px-2.5 py-1 text-xs">
                  {genderLabels[g] ?? g}{" "}
                  <span className="font-semibold tabular-nums">{n}</span>
                </span>
              ))}
            </div>
          )}

          <ul className="max-h-72 space-y-3 overflow-auto pr-1">
            {rows.map(([name, count]) => {
              const unassigned = name === UNASSIGNED;
              return (
                <li key={name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={cn("truncate", unassigned ? "text-amber-700 dark:text-amber-400" : "font-medium")}>
                      {name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground">{count}</span> ·{" "}
                      {Math.round((count / total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", unassigned ? "bg-amber-500" : "bg-primary")}
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </DashboardPanel>
  );
}
