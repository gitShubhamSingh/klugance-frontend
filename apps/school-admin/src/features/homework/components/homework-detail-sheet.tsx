"use client";

import { useState } from "react";
import { Paperclip, UserRound } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import { useSchoolHomeworkDetail } from "../hooks/use-homework";
import {
  formatDay,
  homeworkStatusLabels,
  homeworkStatusStyles,
  isSafeLink,
  parseTimestamp,
  submissionLabels,
  submissionStyles,
  targetLabels,
} from "../lib/homework-utils";
import type { HomeworkSubmission, SchoolHomeworkDetail } from "../types/homework";

type Tab = "all" | "waiting" | "checked" | "rejected" | "missing";

const TABS: Array<{ value: Tab; label: string; match: (s: HomeworkSubmission) => boolean }> = [
  { value: "all", label: "All", match: () => true },
  { value: "waiting", label: "Waiting", match: (s) => s.status === "SUBMITTED" || s.status === "LATE" },
  { value: "checked", label: "Checked", match: (s) => s.status === "REVIEWED" },
  { value: "rejected", label: "Rejected", match: (s) => s.status === "REJECTED" },
  { value: "missing", label: "Not submitted", match: (s) => s.status === "NOT_SUBMITTED" || s.status === "PENDING" },
];

export function HomeworkDetailSheet({ homeworkId, date, onClose }: { homeworkId: string | null; date: string; onClose: () => void }) {
  const query = useSchoolHomeworkDetail(homeworkId, date);

  return (
    <Sheet open={Boolean(homeworkId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        {query.data && query.data.id === homeworkId ? (
          <Detail homework={query.data} />
        ) : query.isError ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {getErrorMessage(query.error)}
          </p>
        ) : (
          <div className="space-y-3 p-6" role="status" aria-label="Loading homework">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ homework: h }: { homework: SchoolHomeworkDetail }) {
  const [tab, setTab] = useState<Tab>("all");
  const visible = h.submissions.filter(TABS.find((t) => t.value === tab)!.match);
  const handedIn = h.stats.pending_review + h.stats.checked;

  return (
    <>
      <SheetHeader className="border-b p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">
            {h.subject_name} · {h.class_name} – {h.section_name}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", homeworkStatusStyles[h.status])}>
            {homeworkStatusLabels[h.status]}
          </span>
          {h.is_overdue && <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:text-rose-300">Overdue</span>}
        </div>
        <SheetTitle className="text-lg">{h.title}</SheetTitle>
        <SheetDescription>
          Set {formatDay(h.assigned_date)} · due {formatDay(h.due_date, true)} · {targetLabels[h.target_type]} · max {h.max_marks} marks
          {h.allow_late_submission ? " · late work accepted" : ""}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 p-5">
        <div className="space-y-2 text-sm">
          {h.teacher_name && (
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <UserRound className="size-3.5" />
              Set by {h.teacher_name}
            </p>
          )}
          <p className="leading-relaxed whitespace-pre-line">{h.description}</p>
          {h.instructions && <p className="rounded-lg bg-muted/50 p-2.5 text-xs whitespace-pre-line">{h.instructions}</p>}
          {isSafeLink(h.attachment_url) && (
            <a href={h.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Paperclip className="size-3.5" />
              Attachment
            </a>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="Students" value={h.stats.recipients} />
          <Stat label="Handed in" value={handedIn} />
          <Stat label="Waiting" value={h.stats.pending_review} tone="text-amber-600" />
          <Stat label="Checked" value={h.stats.checked} tone="text-emerald-600" />
        </div>

        <div>
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filter students">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                  tab === t.value ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                {t.label} ({h.submissions.filter(t.match).length})
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {visible.length === 0 ? (
              <li className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">Nobody here.</li>
            ) : (
              visible.map((s) => <SubmissionRow key={s.enrollment_id} sub={s} maxMarks={h.max_marks} />)
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

function SubmissionRow({ sub, maxMarks }: { sub: HomeworkSubmission; maxMarks: number }) {
  const [open, setOpen] = useState(false);
  const handedIn = Boolean(sub.submitted_at);

  return (
    <li className="rounded-xl border">
      <button
        type="button"
        aria-expanded={open}
        disabled={!handedIn}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-left disabled:cursor-default"
      >
        <span className="w-8 text-xs text-muted-foreground tabular-nums">{sub.roll_number}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{sub.name}</span>
          {sub.submitted_at && (
            <span className="block text-[11px] text-muted-foreground">
              {parseTimestamp(sub.submitted_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              {sub.submitted_by_role === "PARENT" ? ` · by ${sub.submitted_by_name ?? "a parent"} (parent)` : " · by the student"}
              {sub.is_late ? " · late" : ""}
            </span>
          )}
        </span>
        {sub.marks !== null && (
          <span className="text-sm font-semibold tabular-nums">
            {sub.marks}/{maxMarks}
          </span>
        )}
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", submissionStyles[sub.status])}>{submissionLabels[sub.status]}</span>
      </button>
      {open && handedIn && (
        <div className="space-y-2 border-t p-3 text-sm">
          {sub.submission_text && <p className="whitespace-pre-line">{sub.submission_text}</p>}
          {isSafeLink(sub.attachment_url) && (
            <a href={sub.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Paperclip className="size-3.5" />
              Open attached link
            </a>
          )}
          {sub.teacher_remark && (
            <p className="rounded-lg bg-muted/50 p-2 text-xs">
              <span className="font-medium">Teacher&apos;s remark:</span> {sub.teacher_remark}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl bg-muted/40 px-2 py-2.5">
      <p className={cn("text-lg font-semibold tabular-nums", tone)}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
