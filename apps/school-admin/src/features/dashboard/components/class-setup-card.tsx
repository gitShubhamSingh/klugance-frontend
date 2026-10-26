"use client";

import { CheckCircle2, CircleAlert, School } from "lucide-react";

import { useClasses } from "@/features/classes/hooks/use-classes";
import type { SchoolClass } from "@/features/classes/types";
import { cn } from "@/lib/utils";

import { DashboardPanel, PanelMessage, PanelSkeleton } from "./dashboard-panel";

/** Which parts of a class are still missing (only counts the API returns). */
function missingParts(c: SchoolClass) {
  const missing: string[] = [];
  if (c.sections_count === 0) missing.push("sections");
  if (c.subjects_count === 0) missing.push("subjects");
  if (c.teachers_count === 0) missing.push("teachers");
  return missing;
}

function Count({ value }: { value?: number }) {
  if (value === undefined || value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className={cn("tabular-nums", value === 0 && "font-medium text-amber-600 dark:text-amber-400")}>
      {value}
    </span>
  );
}

export function ClassSetupCard({ academicYearId }: { academicYearId?: string }) {
  const classes = useClasses(academicYearId);
  const list = [...(classes.data ?? [])].sort((a, b) => a.display_order - b.display_order);
  const ready = list.filter((c) => missingParts(c).length === 0).length;

  return (
    <DashboardPanel
      title="Class setup"
      description={
        list.length ? `${ready} of ${list.length} classes fully set up` : "Sections, subjects and teachers per class"
      }
      icon={School}
      link={{ href: "/academics/classes", label: "Manage" }}
      className="xl:col-span-2"
      contentClassName="p-0"
    >
      {!academicYearId ? (
        <div className="p-5">
          <PanelMessage
            title="No current academic year"
            description="Set a current academic year to see its classes."
            action={{ href: "/academics/academic-years", label: "Academic years" }}
          />
        </div>
      ) : classes.isPending ? (
        <div className="p-5">
          <PanelSkeleton rows={5} />
        </div>
      ) : classes.isError ? (
        <div className="p-5">
          <PanelMessage title="Couldn't load classes" description="Please try again in a moment." />
        </div>
      ) : list.length === 0 ? (
        <div className="p-5">
          <PanelMessage
            title="No classes yet"
            description="Create classes for this academic year to get started."
            action={{ href: "/academics/classes", label: "Add classes" }}
          />
        </div>
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Class</th>
                <th className="px-3 py-2.5 text-center font-medium">Sections</th>
                <th className="px-3 py-2.5 text-center font-medium">Subjects</th>
                <th className="px-3 py-2.5 text-center font-medium">Teachers</th>
                <th className="px-5 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const missing = missingParts(c);
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.code}</p>
                    </td>
                    <td className="px-3 py-3 text-center"><Count value={c.sections_count} /></td>
                    <td className="px-3 py-3 text-center"><Count value={c.subjects_count} /></td>
                    <td className="px-3 py-3 text-center"><Count value={c.teachers_count} /></td>
                    <td className="px-5 py-3 text-right">
                      {missing.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span
                          title={`Missing ${missing.join(", ")}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400"
                        >
                          <CircleAlert className="size-3.5" />
                          <span className="hidden sm:inline">No {missing.join(", ")}</span>
                          <span className="sm:hidden">Setup</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardPanel>
  );
}
