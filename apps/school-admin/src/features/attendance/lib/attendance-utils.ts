import type { DayStatus, PeriodStatus } from "../types/attendance";

/** YYYY-MM-DD in the admin's local time zone. */
export function toDateKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function shiftDateKey(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  return toDateKey(new Date(y!, m! - 1, d! + days));
}

export function formatDateKey(key: string, options: Intl.DateTimeFormatOptions) {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(y!, m! - 1, d!));
}

export function formatTime(hhmm: string) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .format(new Date(2000, 0, 1, h, m))
    .toUpperCase();
}

export function studentName(s: { first_name: string; middle_name: string | null; last_name: string }) {
  return [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");
}

export const dayStatusLabels: Record<DayStatus, string> = {
  PRESENT: "Present",
  LATE: "Late",
  PARTIAL: "Partial",
  ABSENT: "Absent",
  LEAVE: "On leave",
};

/** Card / chip colours per day status; null = not marked. */
export function dayStatusStyle(status: DayStatus | null) {
  switch (status) {
    case "PRESENT":
      return { card: "border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-950/30", avatar: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300", dot: "bg-green-500" };
    case "LATE":
      return { card: "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30", avatar: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300", dot: "bg-amber-500" };
    case "PARTIAL":
      return { card: "border-orange-200 bg-orange-50/70 dark:border-orange-900 dark:bg-orange-950/30", avatar: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300", dot: "bg-orange-500" };
    case "ABSENT":
      return { card: "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30", avatar: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300", dot: "bg-red-500" };
    case "LEAVE":
      return { card: "border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/30", avatar: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300", dot: "bg-sky-500" };
    default:
      return { card: "border-border bg-muted/30", avatar: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/40" };
  }
}

export const periodStatusLabels: Record<PeriodStatus, string> = {
  PRESENT: "Present",
  LATE: "Late",
  HALF_DAY: "Half day",
  ABSENT: "Absent",
  LEAVE: "Leave",
};

export const periodStatusDot: Record<PeriodStatus, string> = {
  PRESENT: "bg-green-500",
  LATE: "bg-amber-500",
  HALF_DAY: "bg-orange-500",
  ABSENT: "bg-red-500",
  LEAVE: "bg-sky-500",
};
