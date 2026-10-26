"use client";

import { useMemo, useState } from "react";
import { BookOpen, ClipboardCheck, Plus, Search, TriangleAlert, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { LoadErrorState } from "@/features/parent-children";
import { formatDay } from "@/features/student/lib/student-utils";
import { cn } from "@/lib/utils";

import { useTeacherHomework } from "../hooks/use-homework";
import { targetLabels } from "../lib/homework-utils";
import type { TeacherHomework } from "../types/homework";
import { CreateHomeworkDialog } from "./create-homework-dialog";
import { HomeworkDetailSheet } from "./homework-detail-sheet";

type Filter = "active" | "review" | "closed" | "all";

export function TeacherHomeworkPage() {
  const today = toLocalDateKey(new Date());
  const query = useTeacherHomework();
  const [filter, setFilter] = useState<Filter>("active");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const all = useMemo(() => query.data ?? [], [query.data]);
  const counts = {
    active: all.filter((h) => h.status === "PUBLISHED").length,
    review: all.filter((h) => h.stats.pending_review > 0).length,
    closed: all.filter((h) => h.status === "CLOSED").length,
    all: all.length,
  };
  const toReview = all.reduce((sum, h) => sum + h.stats.pending_review, 0);

  const visible = all.filter((h) => {
    if (filter === "active" && h.status !== "PUBLISHED") return false;
    if (filter === "review" && h.stats.pending_review === 0) return false;
    if (filter === "closed" && h.status !== "CLOSED") return false;
    const q = search.trim().toLowerCase();
    return !q || `${h.title} ${h.subject_name} ${h.class_name} ${h.section_name}`.toLowerCase().includes(q);
  });

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
            <p className="mt-2 text-muted-foreground">
              {toReview > 0
                ? `${toReview} ${toReview === 1 ? "submission is" : "submissions are"} waiting for you to check.`
                : "Set homework for a class, a section or chosen students, then check what comes back."}
            </p>
          </div>
          <Button type="button" onClick={() => setCreating(true)}>
            <Plus />
            Set homework
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filter homework">
            {(
              [
                ["active", "Active"],
                ["review", "To review"],
                ["closed", "Closed"],
                ["all", "All"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === value ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                {label}
                <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", filter === value ? "bg-background/20" : "bg-muted")}>
                  {counts[value]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search homework" aria-label="Search homework" className="pl-8" />
          </div>
        </div>

        {query.isLoading ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading homework">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : query.isError ? (
          <LoadErrorState title="Unable to load homework" message={getErrorMessage(query.error)} onRetry={() => void query.refetch()} />
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <BookOpen className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 font-medium">{all.length === 0 ? "No homework yet" : "Nothing matches"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {all.length === 0 ? "Set your first homework — students and parents get notified." : "Try another filter or search."}
            </p>
            {all.length === 0 && (
              <Button type="button" className="mt-4" onClick={() => setCreating(true)}>
                <Plus />
                Set homework
              </Button>
            )}
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((h) => (
              <li key={h.id}>
                <HomeworkCard homework={h} today={today} onOpen={() => setOpenId(h.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateHomeworkDialog open={creating} onOpenChange={setCreating} />
      <HomeworkDetailSheet homeworkId={openId} onClose={() => setOpenId(null)} />
    </PageContainer>
  );
}

function HomeworkCard({ homework: h, today, onOpen }: { homework: TeacherHomework; today: string; onOpen: () => void }) {
  const handedIn = h.stats.pending_review + h.stats.checked;
  const progress = h.stats.recipients ? handedIn / h.stats.recipients : 0;
  const overdue = h.status === "PUBLISHED" && h.due_date < today;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full w-full flex-col rounded-2xl border bg-card p-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {h.subject_name} · {h.class_name} – {h.section_name}
        </span>
        {h.status === "CLOSED" && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">Closed</span>}
      </div>
      <p className="mt-1.5 line-clamp-2 font-medium">{h.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" />
          {targetLabels[h.target_type]}
          {h.target_type === "STUDENTS" && ` (${h.stats.recipients})`}
        </span>
        <span className={cn("inline-flex items-center gap-1", overdue && "font-medium text-rose-600 dark:text-rose-400")}>
          {overdue && <TriangleAlert className="size-3.5" />}
          Due {formatDay(h.due_date)}
        </span>
      </div>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {handedIn}/{h.stats.recipients} handed in
          </span>
          {h.stats.pending_review > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-300">
              <ClipboardCheck className="size-3.5" />
              {h.stats.pending_review} to review
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </button>
  );
}
