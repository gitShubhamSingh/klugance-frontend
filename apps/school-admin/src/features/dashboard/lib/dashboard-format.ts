/** Small formatting helpers for the school-admin dashboard. */

export function fullName(person: {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
}) {
  return [person.first_name, person.middle_name, person.last_name]
    .filter(Boolean)
    .join(" ");
}

export function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** Parses "YYYY-MM-DD" (or ISO) as a local date. */
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: string | null | undefined) {
  const d = parseDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** "08:30:00" / "08:30" → minutes since midnight. */
export function timeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** "13:30:00" → "1:30 PM" */
export function formatClock(value: string) {
  const mins = timeToMinutes(value);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Progress through the academic year based on its start / end dates. */
export function academicYearProgress(start: string, end: string, today = new Date()) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e || e <= s) return null;

  const day = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((e.getTime() - s.getTime()) / day) + 1;
  const elapsed = Math.round((today.getTime() - s.getTime()) / day) + 1;

  if (elapsed < 1) return { state: "upcoming" as const, totalDays, elapsed: 0, percent: 0 };
  if (elapsed > totalDays) return { state: "ended" as const, totalDays, elapsed: totalDays, percent: 100 };
  return {
    state: "running" as const,
    totalDays,
    elapsed,
    percent: Math.round((elapsed / totalDays) * 100),
  };
}
