import type { HomeworkStatus, HomeworkTargetType, SubmissionStatus } from "../types/homework";

/** YYYY-MM-DD in the admin's local time zone. */
export function toDateKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDay(key: string, withYear = false) {
  return new Date(`${key}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

/** Backend timestamps are naive UTC. */
export function parseTimestamp(iso: string) {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
}

export function formatWhen(iso: string, now = Date.now()) {
  const date = parseTimestamp(iso);
  const minutes = Math.round((now - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)} h ago`;
  return date.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export const homeworkStatusLabels: Record<HomeworkStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Active",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export const homeworkStatusStyles: Record<HomeworkStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  CLOSED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export const targetLabels: Record<HomeworkTargetType, string> = {
  CLASS: "Whole class",
  SECTION: "Section",
  STUDENTS: "Selected students",
};

export const submissionLabels: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "Not submitted",
  PENDING: "Not submitted",
  SUBMITTED: "Waiting for teacher",
  LATE: "Waiting for teacher (late)",
  REVIEWED: "Checked",
  REJECTED: "Rejected",
};

export const submissionStyles: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "bg-muted text-muted-foreground",
  PENDING: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  LATE: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  REVIEWED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function isSafeLink(url: string | null): url is string {
  return Boolean(url && /^https?:\/\//i.test(url));
}
