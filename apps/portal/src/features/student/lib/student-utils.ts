import type { StudentHomeworkItem, SubmissionStatus } from "../types/student";

export function formatPercent(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : `${Math.round(value)}%`;
}

/** "Mon, 27 Oct" for a "YYYY-MM-DD" date. */
export function formatDay(iso: string, withYear = false) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

/** Whole days from the local "today" to a "YYYY-MM-DD" date. */
export function daysFrom(todayIso: string, iso: string) {
  const a = new Date(`${todayIso}T00:00:00`).getTime();
  const b = new Date(`${iso}T00:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function dueLabel(item: StudentHomeworkItem, todayIso: string) {
  const days = daysFrom(todayIso, item.due_date);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 0) return `Overdue by ${-days} ${days === -1 ? "day" : "days"}`;
  return `Due ${formatDay(item.due_date)}`;
}

export const submissionLabels: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "Not submitted",
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  LATE: "Submitted late",
  REVIEWED: "Reviewed",
  REJECTED: "Returned",
};

export const submissionStyles: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  SUBMITTED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  LATE: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  REVIEWED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function isHandedIn(item: StudentHomeworkItem) {
  return item.submission_status === "SUBMITTED" || item.submission_status === "LATE" || item.submission_status === "REVIEWED";
}
