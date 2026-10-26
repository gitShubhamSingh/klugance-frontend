import type { HomeworkDisplayStatus } from "@/features/student/types/student";

import type { HomeworkTargetType, SubmissionStatus } from "../types/homework";

/** What students and parents see. */
export const displayStatusLabels: Record<HomeworkDisplayStatus, string> = {
  NOT_SUBMITTED: "Not submitted",
  PENDING: "Pending",
  CHECKED: "Checked",
  REJECTED: "Rejected",
};

export const displayStatusStyles: Record<HomeworkDisplayStatus, string> = {
  NOT_SUBMITTED: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  CHECKED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

/** What the teacher sees per student. */
export const submissionLabels: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "Not submitted",
  PENDING: "Not submitted",
  SUBMITTED: "To review",
  LATE: "To review (late)",
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

export const targetLabels: Record<HomeworkTargetType, string> = {
  CLASS: "Whole class",
  SECTION: "Section",
  STUDENTS: "Selected students",
};

export function isSafeLink(url: string | null): url is string {
  return Boolean(url && /^https?:\/\//i.test(url));
}
