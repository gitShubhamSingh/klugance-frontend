import type { AttendanceRegister, MarkStatus, RegisterStudent } from "../types/teacher-attendance";
import { toMarkStatus } from "../types/teacher-attendance";

export function studentName(s: Pick<RegisterStudent, "first_name" | "middle_name" | "last_name">) {
  return [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");
}

/** Saved marks of a register, keyed by enrollment id. */
export function savedMarks(register: AttendanceRegister): Record<string, MarkStatus> {
  const marks: Record<string, MarkStatus> = {};
  register.students.forEach((s) => {
    if (s.status) marks[s.enrollment_id] = toMarkStatus[s.status];
  });
  return marks;
}

/** Natural roll-number order: "2" before "10". */
export function compareRoll(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/** "13:30" → "1:30 PM" style label for an ISO timestamp. */
export function formatSubmittedAt(iso: string | null) {
  if (!iso) return undefined;
  // Backend timestamps are UTC without a zone suffix.
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    .format(date)
    .toUpperCase();
}
