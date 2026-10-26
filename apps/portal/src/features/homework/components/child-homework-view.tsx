"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Paperclip,
  RotateCcw,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import { parseTimestamp } from "@/features/communication/lib/chat-utils";
import { LoadErrorState } from "@/features/parent-children";
import { dueLabel, formatDay } from "@/features/student/lib/student-utils";
import type { HomeworkDisplayStatus, StudentHomeworkItem } from "@/features/student/types/student";
import { cn } from "@/lib/utils";

import type { ChildHomeworkSource } from "../api/homework";
import { useChildHomework, useSubmitChildHomework } from "../hooks/use-homework";
import { displayStatusLabels, displayStatusStyles, isSafeLink } from "../lib/homework-utils";
import { SubmitHomeworkForm } from "./submit-homework-form";

type Filter = "todo" | HomeworkDisplayStatus | "all";

/**
 * A student's homework with its status and a way to hand it in. Used by
 * the student portal and, for a chosen child, by the parent portal.
 */
export function ChildHomeworkView({
  source,
  today,
  childFirstName,
}: {
  source: ChildHomeworkSource;
  today: string;
  /** Parent view: the child's name for wording. */
  childFirstName?: string;
}) {
  const query = useChildHomework(source, today);
  const submit = useSubmitChildHomework(source, today);
  const [filter, setFilter] = useState<Filter>("todo");
  const [openId, setOpenId] = useState<string | null>(null);
  const [formFor, setFormFor] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const data = query.data;

  const isToDo = (i: StudentHomeworkItem) =>
    (i.display_status === "NOT_SUBMITTED" || i.display_status === "REJECTED") && i.can_submit;

  const items = useMemo(() => {
    const all = data?.items ?? [];
    if (filter === "todo") return all.filter(isToDo);
    if (filter === "all") return all;
    return all.filter((i) => i.display_status === filter);
  }, [data, filter]);

  if (query.isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading homework">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (query.isError || !data) {
    return (
      <LoadErrorState
        title="Unable to load homework"
        message={getErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const s = data.summary;
  const filters: Array<{ value: Filter; label: string; count: number }> = [
    { value: "todo", label: "To do", count: s.to_do },
    { value: "PENDING", label: "Pending", count: s.pending },
    { value: "CHECKED", label: "Checked", count: s.reviewed },
    { value: "REJECTED", label: "Rejected", count: s.rejected },
    { value: "all", label: "All", count: s.total },
  ];

  function handIn(item: StudentHomeworkItem, payload: { submission_text: string | null; attachment_url: string | null }) {
    setSubmitError(null);
    submit.mutate(
      { homeworkId: item.id, payload },
      {
        onSuccess: () => {
          setFormFor(null);
          toast.success("Homework submitted", { description: `${item.subject_name} · ${item.title}` });
        },
        onError: (error) => setSubmitError(getErrorMessage(error)),
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]" role="tablist" aria-label="Filter homework">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.value ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            {f.label}
            <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", filter === f.value ? "bg-background/20" : "bg-muted")}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <BookOpen className="mx-auto size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {s.total === 0
              ? "No homework has been set yet."
              : filter === "todo"
                ? "Nothing to do — all caught up!"
                : "Nothing here."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const open = openId === item.id || formFor === item.id;
            return (
              <HomeworkCard
                key={item.id}
                item={item}
                today={today}
                open={open}
                onToggle={() => setOpenId(open ? null : item.id)}
                formOpen={formFor === item.id}
                onOpenForm={() => {
                  setSubmitError(null);
                  setFormFor(item.id);
                }}
                onCloseForm={() => setFormFor(null)}
                submitting={submit.isPending && submit.variables?.homeworkId === item.id}
                submitError={formFor === item.id ? submitError : null}
                onSubmit={(payload) => handIn(item, payload)}
                childFirstName={childFirstName}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

function HomeworkCard({
  item,
  today,
  open,
  onToggle,
  formOpen,
  onOpenForm,
  onCloseForm,
  submitting,
  submitError,
  onSubmit,
  childFirstName,
}: {
  item: StudentHomeworkItem;
  today: string;
  open: boolean;
  onToggle: () => void;
  formOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (payload: { submission_text: string | null; attachment_url: string | null }) => void;
  childFirstName?: string;
}) {
  const status = item.display_status;
  const handedIn = status === "PENDING" || status === "CHECKED";
  const closed = item.homework_status === "CLOSED";
  const submitLabel = status === "REJECTED" ? "Submit again" : status === "PENDING" ? "Update submission" : "Submit";

  return (
    <li className="overflow-hidden rounded-2xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{item.subject_name}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", displayStatusStyles[status])}>
              {displayStatusLabels[status]}
            </span>
            {closed && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Closed</span>}
          </div>
          <p className="mt-1.5 font-medium">{item.title}</p>
          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 text-xs",
              item.is_overdue && !closed && !handedIn ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
            )}
          >
            {handedIn ? <CheckCircle2 className="size-3.5" /> : item.is_overdue ? <TriangleAlert className="size-3.5" /> : <Clock3 className="size-3.5" />}
            {handedIn && item.submitted_at
              ? `Handed in ${parseTimestamp(item.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}${
                  item.submitted_by_role === "PARENT" ? " by a parent" : ""
                }${item.is_late ? " (late)" : ""}`
              : dueLabel(item, today)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {item.marks !== null ? (
            <p className="text-lg font-semibold tabular-nums">
              {item.marks}
              <span className="text-xs text-muted-foreground">/{item.max_marks}</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Max {item.max_marks}</p>
          )}
        </div>
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-4 border-t p-4 text-sm sm:p-5">
          <p className="leading-relaxed whitespace-pre-line">{item.description}</p>
          {item.instructions && (
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Instructions</p>
              <p className="mt-1 whitespace-pre-line">{item.instructions}</p>
            </div>
          )}
          <dl className="grid gap-3 text-xs sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Set on</dt>
              <dd className="font-medium">{formatDay(item.assigned_date, true)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Due</dt>
              <dd className="font-medium">{formatDay(item.due_date, true)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Late submission</dt>
              <dd className="font-medium">{item.allow_late_submission ? "Allowed" : "Not allowed"}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {item.teacher_name && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5" />
                {item.teacher_name}
              </span>
            )}
            {isSafeLink(item.attachment_url) && (
              <a
                href={item.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Paperclip className="size-3.5" />
                Teacher&apos;s attachment
              </a>
            )}
          </div>

          {item.teacher_remark && (
            <div
              className={cn(
                "rounded-xl border p-3",
                status === "REJECTED" ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/30 bg-emerald-500/5",
              )}
            >
              <p className={cn("text-xs font-medium", status === "REJECTED" ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300")}>
                {status === "REJECTED" ? "Teacher's reason for rejecting" : "Teacher's remark"}
              </p>
              <p className="mt-1">{item.teacher_remark}</p>
            </div>
          )}

          {(item.submission_text || item.submission_attachment_url) && !formOpen && (
            <div className="rounded-xl border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Submitted work
                {item.submitted_by_name && ` · by ${item.submitted_by_name}${item.submitted_by_role === "PARENT" ? " (parent)" : ""}`}
              </p>
              {item.submission_text && <p className="mt-1 whitespace-pre-line">{item.submission_text}</p>}
              {isSafeLink(item.submission_attachment_url) && (
                <a
                  href={item.submission_attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Paperclip className="size-3.5" />
                  Attached link
                </a>
              )}
            </div>
          )}

          {formOpen ? (
            <SubmitHomeworkForm
              initialText={status === "PENDING" ? item.submission_text : null}
              initialLink={status === "PENDING" ? item.submission_attachment_url : null}
              submitLabel={submitLabel}
              submitting={submitting}
              error={submitError}
              onSubmit={onSubmit}
              onCancel={onCloseForm}
            />
          ) : item.can_submit ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {status === "PENDING"
                  ? "Waiting for the teacher to check it. You can still update it until then."
                  : childFirstName
                    ? `You can hand this in for ${childFirstName}.`
                    : "Hand in your work when it's ready."}
              </p>
              <Button type="button" size="sm" variant={status === "PENDING" ? "outline" : "default"} onClick={onOpenForm}>
                {status === "REJECTED" && <RotateCcw />}
                {submitLabel}
              </Button>
            </div>
          ) : (
            item.submit_blocked_reason &&
            status !== "CHECKED" && <p className="text-xs text-muted-foreground">{item.submit_blocked_reason}</p>
          )}
        </div>
      )}
    </li>
  );
}
