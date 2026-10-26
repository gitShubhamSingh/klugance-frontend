"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { OverviewSection } from "../types/attendance";

/** Every section's day at a glance; click a row to open it above. */
export function AttendanceSections({
  sections,
  loading,
  selectedId,
  onSelect,
}: {
  sections: OverviewSection[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (sectionId: string) => void;
}) {
  return (
    <section className="rounded-xl border bg-card" aria-label="All sections">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">All sections</h2>
        <p className="text-sm text-muted-foreground">How far each class has got with attendance for this day.</p>
      </div>

      {loading ? (
        <div className="space-y-2 p-5">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Class</th>
                <th className="px-3 py-2.5 font-medium">Periods marked</th>
                <th className="px-3 py-2.5 text-right font-medium">Students</th>
                <th className="px-3 py-2.5 text-right font-medium">Present</th>
                <th className="px-3 py-2.5 text-right font-medium">Partial</th>
                <th className="px-3 py-2.5 text-right font-medium">Absent</th>
                <th className="px-3 py-2.5 text-right font-medium">Not marked</th>
                <th className="px-5 py-2.5 text-right font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => {
                const progress = s.periods_scheduled ? s.periods_marked / s.periods_scheduled : 0;
                return (
                  <tr
                    key={s.section_id}
                    onClick={() => onSelect(s.section_id)}
                    className={cn(
                      "cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/50",
                      s.section_id === selectedId && "bg-muted/60",
                    )}
                  >
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => onSelect(s.section_id)}
                        aria-current={s.section_id === selectedId ? "true" : undefined}
                        className="font-medium hover:underline"
                      >
                        {s.class_name} – {s.section_name}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      {s.periods_scheduled === 0 ? (
                        <span className="text-xs text-muted-foreground">No periods today</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full", progress === 1 ? "bg-green-500" : "bg-amber-500")}
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums">
                            {s.periods_marked}/{s.periods_scheduled}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{s.total_students}</td>
                    <td className="px-3 py-3 text-right text-green-700 tabular-nums dark:text-green-400">{s.present + s.late}</td>
                    <td className="px-3 py-3 text-right text-orange-700 tabular-nums dark:text-orange-400">{s.partial}</td>
                    <td className="px-3 py-3 text-right text-red-700 tabular-nums dark:text-red-400">{s.absent}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">{s.not_marked}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {s.attendance_percent != null ? `${s.attendance_percent}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
