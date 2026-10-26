/*
 * API shapes — mirror backend_v2 school attendance schemas
 * (app/modules/attendance/schemas/school_attendance_schemas.py).
 */

/** One period's mark. */
export type PeriodStatus = "PRESENT" | "LATE" | "HALF_DAY" | "ABSENT" | "LEAVE";

/** Period marks rolled up into one status for the day. */
export type DayStatus = "PRESENT" | "LATE" | "PARTIAL" | "ABSENT" | "LEAVE";

export type AttendanceSummary = {
  total_students: number;
  present: number;
  late: number;
  partial: number;
  absent: number;
  leave: number;
  /** No period marked for the student yet. */
  not_marked: number;
  periods_scheduled: number;
  periods_marked: number;
  /** Period-based; null when nothing is marked. */
  attendance_percent: number | null;
};

export type AttendancePeriod = {
  period_number: number;
  period_name: string;
  /** "HH:MM"; empty for a period marked off the timetable. */
  start_time: string;
  end_time: string;
  subject_name: string | null;
  teacher_name: string | null;
  marked: boolean;
  marked_by_name: string | null;
  marked_at: string | null;
  present: number;
  late: number;
  half_day: number;
  absent: number;
  leave: number;
};

export type AttendanceStudent = {
  enrollment_id: string;
  student_profile_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  roll_number: string;
  admission_number: string;
  day_status: DayStatus | null;
  periods_marked: number;
  periods_attended: number;
  marks: Array<{ period_number: number; status: PeriodStatus }>;
};

export type SectionAttendance = {
  date: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  summary: AttendanceSummary;
  periods: AttendancePeriod[];
  students: AttendanceStudent[];
};

export type OverviewSection = AttendanceSummary & {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
};

export type AttendanceOverview = {
  date: string;
  totals: AttendanceSummary;
  sections: OverviewSection[];
};
