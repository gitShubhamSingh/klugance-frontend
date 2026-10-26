import type { ClassSection, TeacherStudent } from "../types/teacher-students";

export type StudentFlag = "top" | "attention" | "steady";

export const flagLabels: Record<StudentFlag, string> = {
  top: "Top performer",
  attention: "Needs attention",
  steady: "On track",
};

export const flagStyles: Record<StudentFlag, string> = {
  top: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  attention: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  steady: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

/** Metrics that are null (nothing marked / graded yet) never flag a student. */
export function getStudentFlag(s: TeacherStudent): StudentFlag {
  if (
    (s.attendance !== null && s.attendance < 80) ||
    (s.avgScore !== null && s.avgScore < 62) ||
    (s.trend !== null && s.trend <= -8) ||
    (s.homeworkRate !== null && s.homeworkRate < 60)
  ) {
    return "attention";
  }
  if (s.avgScore !== null && s.avgScore >= 90) return "top";
  return "steady";
}

/** Short human reason for why a student is flagged. */
export function getAttentionReason(s: TeacherStudent) {
  if (s.trend !== null && s.trend <= -8) return `Score dropped ${Math.abs(s.trend)} pts in the last test`;
  if (s.attendance !== null && s.attendance < 80) return `Attendance at ${s.attendance}%`;
  if (s.homeworkRate !== null && s.homeworkRate < 60) return `Only ${s.homeworkRate}% homework submitted`;
  if (s.avgScore !== null && s.avgScore < 62) return `Average score ${s.avgScore}%`;
  return "Keep an eye on progress";
}

/** Average of the known values; null when there are none. */
export function average(values: Array<number | null>) {
  const known = values.filter((v): v is number => v !== null);
  if (known.length === 0) return null;
  return Math.round(known.reduce((sum, v) => sum + v, 0) / known.length);
}

export function formatPercent(value: number | null) {
  return value === null ? "—" : `${value}%`;
}

export function getSectionSummary(section: ClassSection, students: TeacherStudent[]) {
  const list = students.filter((s) => s.sectionId === section.id);
  return {
    count: list.length,
    avgScore: average(list.map((s) => s.avgScore)),
    attendance: average(list.map((s) => s.attendance)),
    presentToday: list.filter((s) => s.presentToday === true).length,
    attention: list.filter((s) => getStudentFlag(s) === "attention").length,
    top: list.filter((s) => getStudentFlag(s) === "top").length,
  };
}

export function scoreTone(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 85) return "text-emerald-700 dark:text-emerald-400";
  if (score >= 65) return "text-foreground";
  return "text-rose-600 dark:text-rose-400";
}

export function attendanceBar(value: number | null) {
  if (value === null) return "bg-muted-foreground/30";
  if (value >= 90) return "bg-emerald-500";
  if (value >= 80) return "bg-amber-500";
  return "bg-rose-500";
}

/** Natural roll-number order: "2" before "10", "A-2" before "A-10". */
export function compareRoll(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
