import type { Tone } from "@/features/dashboard/lib/tones";

/*
 * API shapes — mirror backend_v2 `TeacherTimetableResponse`
 * (app/modules/timetable/schemas/teacher_timetable_response.py).
 */

export type TeacherTimetableApiEntry = {
  timetable_entry_id: string;
  teacher_assignment_id: string;
  /** "MONDAY" … "SUNDAY" */
  day_of_week: string;
  period_id: string;
  period_name: string;
  period_number: number;
  /** 24h "HH:MM" */
  start_time: string;
  end_time: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_name: string;
  student_count: number;
};

export type TeacherTimetableApiSection = {
  section_id: string;
  class_name: string;
  section_name: string;
  subjects: string[];
  periods_per_week: number;
  student_count: number;
};

export type TeacherTimetableApiResponse = {
  academic_year_name: string | null;
  entries: TeacherTimetableApiEntry[];
  sections: TeacherTimetableApiSection[];
};

/*
 * View model for the timetable components.
 */

/** A bell-schedule row. `period` is the row number (1-based). */
export type Slot =
  | { kind: "period"; period: number; start: string; end: string }
  | { kind: "break"; label: string; start: string; end: string };

export type Lesson = {
  kind: "class";
  timetableEntryId: string;
  sectionId: string;
  sectionName: string;
  subject: string;
  periodName: string;
  studentCount: number;
};

export type SchoolDay = { day: number; short: string; long: string };

export type TimetableSection = {
  id: string;
  name: string;
  shortName: string;
  subjects: string;
  periodsPerWeek: number;
  studentCount: number;
  tone: Tone;
};

export type TimetableModel = {
  academicYearName: string | null;
  bellSchedule: Slot[];
  /** Date#getDay() numbers shown as columns (Mon … Sat, plus Sun if used). */
  schoolDays: SchoolDay[];
  /** weekly[day][period] — missing entries are free periods. */
  weekly: Record<number, Record<number, Lesson>>;
  sections: TimetableSection[];
};
