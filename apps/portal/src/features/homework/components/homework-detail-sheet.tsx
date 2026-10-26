"use client";

import { useState } from "react";
import { Ban, CheckCircle2, Loader2, Lock, Paperclip, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/core/api/get-error-message";
import { parseTimestamp } from "@/features/communication/lib/chat-utils";
import { formatDay } from "@/features/student/lib/student-utils";
import { cn } from "@/lib/utils";

import { useCancelHomework, useCloseHomework, useReviewSubmission, useTeacherHomeworkDetail } from "../hooks/use-homework";
import { isSafeLink, submissionLabels, submissionStyles, targetLabels } from "../lib/homework-utils";
import type { TeacherHomeworkDetail, TeacherHomeworkSubmission } from "../types/homework";

type Tab = "review" | "checked" | "rejected" | "missing" | "all";

const TABS: Array<{ value: Tab; label: string; match: (s: TeacherHomeworkSubmission) => boolean }> = [
  { value: "review", label: "To review", match: (s) => s.status === "SUBMITTED" || s.status === "LATE" },
  { value: "checked", label: "Checked", match: (s) => s.status === "REVIEWED" },
  { value: "rejected", label: "Rejected", match: (s) => s.status === "REJECTED" },
  { value: "missing", label: "Not submitted", match: (s) => s.status === "NOT_SUBMITTED" || s.status === "PENDING" },
  { value: "all", label: "All", match: () => true },
];

export function HomeworkDetailSheet({ homeworkId, onClose }: { homeworkId: string | null; onClose: () => void }) {
  const query = useTeacherHomeworkDetail(homeworkId);

  return (
    <Sheet open={Boolean(homeworkId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        {query.isLoading || !query.data ? (
          <div className="space-y-3 p-6" role="status" aria-label="Loading homework">
            {query.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(query.error)}</p>
            ) : (
              <>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </>
            )}
          </div>
        ) : (
          <Detail homework={query.data} onCancelled={onClose} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ homework, onCancelled }: { homework: TeacherHomeworkDetail; onCancelled: () => void }) {
  const [tab, setTab] = useState<Tab>(homework.stats.pending_review > 0 ? "review" : "all");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const close = useCloseHomework();
  const cancel = useCancelHomework();
  const s = homework.stats;
  const open = homework.status === "PUBLISHED";
  const visible = homework.submissions.filter(TABS.find((t) => t.value === tab)!.match);

  return (
    <>
      <SheetHeader className="border-b p-5">
        <p className="text-xs font-medium text-muted-foreground">
          {homework.subject_name} · {homework.class_name} – {homework.section_name} · {targetLabels[homework.target_type]}
        </p>
        <SheetTitle className="text-lg">{homework.title}</SheetTitle>
        <SheetDescription>
          Due {formatDay(homework.due_date, true)} · Max {homework.max_marks} marks
          {homework.allow_late_submission ? " · late work accepted" : ""}
          {!open && " · closed"}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{homework.description}</p>
          {homework.instructions && (
            <p className="mt-2 rounded-lg bg-muted/50 p-2.5 text-xs whitespace-pre-line">{homework.instructions}</p>
          )}
          {isSafeLink(homework.attachment_url) && (
            <a
              href={homework.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Paperclip className="size-3.5" />
              Attachment
            </a>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="Students" value={s.recipients} />
          <Stat label="To review" value={s.pending_review} tone="text-amber-600" />
          <Stat label="Checked" value={s.checked} tone="text-emerald-600" />
          <Stat label="Missing" value={s.not_submitted} />
        </div>

        <div className="flex flex-wrap gap-2">
          {open && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={close.isPending}
              onClick={() =>
                close.mutate(homework.id, {
                  onSuccess: () => toast.success("Submissions closed"),
                  onError: (e) => toast.error(getErrorMessage(e)),
                })
              }
            >
              {close.isPending ? <Loader2 className="animate-spin" /> : <Lock />}
              Stop accepting work
            </Button>
          )}
          {confirmCancel ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-2 py-1 text-xs">
              Cancel this homework for everyone?
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={cancel.isPending}
                onClick={() =>
                  cancel.mutate(homework.id, {
                    onSuccess: () => {
                      toast.success("Homework cancelled");
                      onCancelled();
                    },
                    onError: (e) => toast.error(getErrorMessage(e)),
                  })
                }
              >
                Yes, cancel
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmCancel(false)}>
                No
              </Button>
            </span>
          ) : (
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmCancel(true)}>
              <Ban />
              Cancel homework
            </Button>
          )}
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
                {t.label} ({homework.submissions.filter(t.match).length})
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {visible.length === 0 ? (
              <li className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">Nobody here.</li>
            ) : (
              visible.map((sub) => <SubmissionRow key={sub.enrollment_id} homework={homework} sub={sub} />)
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

function SubmissionRow({ homework, sub }: { homework: TeacherHomeworkDetail; sub: TeacherHomeworkSubmission }) {
  const review = useReviewSubmission();
  const [open, setOpen] = useState(sub.status === "SUBMITTED" || sub.status === "LATE");
  const [marks, setMarks] = useState(sub.marks?.toString() ?? "");
  const [remark, setRemark] = useState(sub.teacher_remark ?? "");
  const [error, setError] = useState<string | null>(null);
  const handedIn = sub.status !== "NOT_SUBMITTED" && sub.status !== "PENDING";
  const canReview = sub.status === "SUBMITTED" || sub.status === "LATE" || sub.status === "REVIEWED";

  function decide(decision: "CHECKED" | "REJECTED") {
    setError(null);
    if (decision === "REJECTED" && !remark.trim()) {
      setError("Add a remark so the student knows what to fix.");
      return;
    }
    const value = marks.trim() === "" ? null : Number(marks);
    if (decision === "CHECKED" && value !== null && (Number.isNaN(value) || value < 0 || value > homework.max_marks)) {
      setError(`Marks must be between 0 and ${homework.max_marks}.`);
      return;
    }
    review.mutate(
      {
        homeworkId: homework.id,
        enrollmentId: sub.enrollment_id,
        payload: { decision, marks: decision === "CHECKED" ? value : null, remark: remark.trim() || null },
      },
      {
        onSuccess: () => toast.success(decision === "CHECKED" ? `Checked: ${sub.name}` : `Sent back to ${sub.name}`),
        onError: (e) => setError(getErrorMessage(e)),
      },
    );
  }

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
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{sub.name}</p>
          {sub.submitted_at && (
            <p className="text-[11px] text-muted-foreground">
              {parseTimestamp(sub.submitted_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              {sub.submitted_by_role === "PARENT" ? ` · by ${sub.submitted_by_name ?? "parent"} (parent)` : ""}
              {sub.is_late ? " · late" : ""}
            </p>
          )}
        </div>
        {sub.marks !== null && (
          <span className="text-sm font-semibold tabular-nums">
            {sub.marks}/{homework.max_marks}
          </span>
        )}
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", submissionStyles[sub.status])}>
          {submissionLabels[sub.status]}
        </span>
      </button>

      {open && handedIn && (
        <div className="space-y-3 border-t p-3 text-sm">
          {sub.submission_text && <p className="whitespace-pre-line">{sub.submission_text}</p>}
          {isSafeLink(sub.attachment_url) && (
            <a
              href={sub.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Paperclip className="size-3.5" />
              Open attached link
            </a>
          )}
          {sub.status === "REJECTED" && sub.teacher_remark && (
            <p className="text-xs text-muted-foreground">Your remark: {sub.teacher_remark} — waiting for a resubmission.</p>
          )}
          {canReview && (
            <div className="space-y-2 rounded-lg bg-muted/40 p-2.5">
              <div className="flex gap-2">
                <div className="flex shrink-0 items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={homework.max_marks}
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="Marks"
                    aria-label={`Marks out of ${homework.max_marks}`}
                    className="w-20 bg-background"
                  />
                  <span className="text-xs text-muted-foreground">/ {homework.max_marks}</span>
                </div>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={1}
                  maxLength={2000}
                  placeholder="Remark (required to reject)"
                  aria-label="Remark"
                  className="min-h-9 bg-background"
                />
              </div>
              {error && (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" disabled={review.isPending} onClick={() => decide("REJECTED")}>
                  <XCircle />
                  Reject
                </Button>
                <Button type="button" size="sm" disabled={review.isPending} onClick={() => decide("CHECKED")}>
                  {review.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  {sub.status === "REVIEWED" ? "Update" : "Mark checked"}
                </Button>
              </div>
            </div>
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
