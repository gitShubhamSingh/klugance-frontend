"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import { useSchoolHomework } from "../hooks/use-homework";
import { formatDay, homeworkStatusLabels, homeworkStatusStyles, targetLabels, toDateKey } from "../lib/homework-utils";
import type { HomeworkStatus, SchoolHomework } from "../types/homework";
import { HomeworkActivityFeed } from "./homework-activity";
import { HomeworkDetailSheet } from "./homework-detail-sheet";

type StatusFilter = "all" | "PUBLISHED" | "overdue" | "review" | "CLOSED" | "CANCELLED";

/**
 * Every homework teachers have set across the school — who it went to,
 * who handed it in (student or parent) and how it was checked. Read-only.
 */
export function HomeworkPage() {
  const today = toDateKey(new Date());
  const query = useSchoolHomework(today);
  const data = query.data;

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("PUBLISHED");
  const [openId, setOpenId] = useState<string | null>(null);

  const homework = useMemo(() => data?.homework ?? [], [data]);
  const classes = [...new Set(homework.map((h) => h.class_name))];
  const teachers = [...new Set(homework.map((h) => h.teacher_name).filter(Boolean))] as string[];

  const visible = homework.filter((h) => {
    if (classFilter !== "all" && h.class_name !== classFilter) return false;
    if (teacherFilter !== "all" && h.teacher_name !== teacherFilter) return false;
    if (status === "overdue" && !h.is_overdue) return false;
    if (status === "review" && h.stats.pending_review === 0) return false;
    if (["PUBLISHED", "CLOSED", "CANCELLED"].includes(status) && h.status !== status) return false;
    const q = search.trim().toLowerCase();
    return !q || `${h.title} ${h.subject_name} ${h.teacher_name ?? ""} ${h.class_name} ${h.section_name}`.toLowerCase().includes(q);
  });

  const o = data?.overview;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ClipboardCheck className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Homework</h1>
            <p className="text-sm text-muted-foreground">
              Everything teachers have set, what came back, and how it was checked.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" size="icon" aria-label="Refresh homework" onClick={() => void query.refetch()}>
          <RefreshCw className={cn("size-4", query.isFetching && "animate-spin")} />
        </Button>
      </div>

      {/* Overview */}
      {!o ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          <Tile label="Active" value={o.active} hint={`${o.total} in total`} />
          <Tile label="Overdue" value={o.overdue} tone="text-rose-600" />
          <Tile label="Given to" value={o.assigned_to} hint="student assignments" />
          <Tile label="Handed in" value={o.handed_in} hint={o.assigned_to ? `${Math.round((o.handed_in / o.assigned_to) * 100)}%` : undefined} />
          <Tile label="Waiting for teacher" value={o.pending_review} tone="text-amber-600" />
          <Tile label="Checked" value={o.checked} tone="text-emerald-600" />
          <Tile label="Rejected" value={o.rejected} tone="text-rose-600" />
        </div>
      )}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Homework list */}
        <section className="rounded-xl border bg-card" aria-label="All homework">
          <div className="flex flex-col gap-3 border-b p-4">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filter by status">
              {(
                [
                  ["PUBLISHED", "Active"],
                  ["overdue", "Overdue"],
                  ["review", "Waiting for teacher"],
                  ["CLOSED", "Closed"],
                  ["CANCELLED", "Cancelled"],
                  ["all", "All"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={status === value}
                  onClick={() => setStatus(value)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    status === value ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, subject or teacher" aria-label="Search homework" className="pl-8" />
              </div>
              <FilterSelect label="Class" value={classFilter} onChange={setClassFilter} options={classes} allLabel="All classes" />
              <FilterSelect label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={teachers} allLabel="All teachers" />
            </div>
          </div>

          {query.isLoading ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : query.isError && !data ? (
            <p role="alert" className="p-6 text-center text-sm text-destructive">
              {getErrorMessage(query.error)}
            </p>
          ) : visible.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              {homework.length === 0 ? "No homework has been set yet. Teachers set it from the Teacher Portal." : "No homework matches these filters."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Homework</th>
                    <th className="px-3 py-2.5 font-medium">Class</th>
                    <th className="px-3 py-2.5 font-medium">Teacher</th>
                    <th className="px-3 py-2.5 font-medium">Due</th>
                    <th className="px-3 py-2.5 font-medium">Handed in</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((h) => (
                    <Row key={h.id} homework={h} onOpen={() => setOpenId(h.id)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <HomeworkActivityFeed onOpen={setOpenId} />
      </div>

      <HomeworkDetailSheet homeworkId={openId} date={today} onClose={() => setOpenId(null)} />
    </div>
  );
}

function Row({ homework: h, onOpen }: { homework: SchoolHomework; onOpen: () => void }) {
  const handedIn = h.stats.pending_review + h.stats.checked;
  const progress = h.stats.recipients ? handedIn / h.stats.recipients : 0;

  return (
    <tr onClick={onOpen} className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/50">
      <td className="px-4 py-3">
        <button type="button" onClick={onOpen} className="text-left font-medium hover:underline">
          {h.title}
        </button>
        <p className="text-xs text-muted-foreground">
          {h.subject_name} · {targetLabels[h.target_type]}
          {h.target_type === "STUDENTS" ? ` (${h.stats.recipients})` : ""}
        </p>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        {h.class_name} – {h.section_name}
      </td>
      <td className="px-3 py-3">{h.teacher_name ?? "—"}</td>
      <td className={cn("px-3 py-3 whitespace-nowrap", h.is_overdue && "font-medium text-rose-600 dark:text-rose-400")}>
        {formatDay(h.due_date)}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="text-xs tabular-nums">
            {handedIn}/{h.stats.recipients}
          </span>
        </div>
        {h.stats.pending_review > 0 && (
          <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300">{h.stats.pending_review} waiting for teacher</p>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", homeworkStatusStyles[h.status as HomeworkStatus])}>
          {h.is_overdue ? "Overdue" : homeworkStatusLabels[h.status]}
        </span>
      </td>
    </tr>
  );
}

function Tile({ label, value, hint, tone }: { label: string; value: number; hint?: string; tone?: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums", tone)}>{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    >
      <option value="all">{allLabel}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
