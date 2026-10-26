/**
 * Progress calculations for an academic year, derived only from its
 * start and end dates (inclusive). Dates are treated as local calendar days.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type YearPhase = "upcoming" | "running" | "ended";

export type MonthSegment = {
  key: string;
  label: string;
  year: number;
  /** Days of this month that fall inside the session (used for width). */
  days: number;
  state: "done" | "current" | "upcoming";
};

export type AcademicYearProgress = {
  phase: YearPhase;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  /** Days until the session starts (only for "upcoming"). */
  daysUntilStart: number;
  percent: number;
  months: number;
  weeksRemaining: number;
  segments: MonthSegment[];
};

export function parseLocalDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

export function getAcademicYearProgress(
  startDate: string,
  endDate: string,
  today: Date = new Date(),
): AcademicYearProgress | null {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (!start || !end || end < start) return null;

  const now = startOfDay(today);
  const totalDays = daysBetween(start, end) + 1;

  let phase: YearPhase = "running";
  let elapsedDays = daysBetween(start, now) + 1;
  if (now < start) {
    phase = "upcoming";
    elapsedDays = 0;
  } else if (now > end) {
    phase = "ended";
    elapsedDays = totalDays;
  }

  const remainingDays = totalDays - elapsedDays;
  const percent = Math.round((elapsedDays / totalDays) * 100);

  // Month-by-month segments from the start month to the end month.
  const segments: MonthSegment[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    const monthStart = new Date(cursor);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const from = monthStart < start ? start : monthStart;
    const to = monthEnd > end ? end : monthEnd;

    let state: MonthSegment["state"] = "upcoming";
    if (now > to) state = "done";
    else if (now >= from) state = "current";

    segments.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(cursor),
      year: cursor.getFullYear(),
      days: daysBetween(from, to) + 1,
      state,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return {
    phase,
    totalDays,
    elapsedDays,
    remainingDays,
    daysUntilStart: phase === "upcoming" ? daysBetween(now, start) : 0,
    percent,
    months: Math.floor(totalDays / 30),
    weeksRemaining: Math.ceil(remainingDays / 7),
    segments,
  };
}

export function formatLongDate(value: string | null | undefined) {
  const d = parseLocalDate(value);
  if (!d) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatWeekday(value: string | null | undefined) {
  const d = parseLocalDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(d);
}
