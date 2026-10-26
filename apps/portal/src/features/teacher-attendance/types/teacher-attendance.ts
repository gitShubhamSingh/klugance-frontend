/*
 * API shapes — mirror backend_v2 teacher attendance schemas
 * (app/modules/attendance/schemas/teacher_attendance_schemas.py).
 */

export type ApiAttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "LEAVE";

/**
 * One status per day, rolled up from its periods (backend
 * attendance_day_rules): PARTIAL = missed some periods or a half day.
 */
export type DayStatus = "PRESENT" | "LATE" | "PARTIAL" | "ABSENT" | "LEAVE";

export const dayStatusLabels: Record<DayStatus, string> = {
  PRESENT: "Present",
  LATE: "Late",
  PARTIAL: "Partly absent",
  ABSENT: "Absent",
  LEAVE: "On leave",
};

export type RegisterStudent = {
  enrollment_id: string;
  student_profile_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  roll_number: string;
  admission_number: string;
  /** Saved mark for this register; null until submitted. */
  status: ApiAttendanceStatus | null;
  remarks: string | null;
  attendance_percent: number | null;
  absent_last_day: boolean;
};

export type AttendanceRegister = {
  timetable_entry_id: string;
  teacher_assignment_id: string;
  period_id: string;
  period_name: string;
  period_number: number;
  /** 24h "HH:MM" */
  start_time: string;
  end_time: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_name: string;
  /** Who teaches this period on the timetable. */
  subject_teacher_name: string | null;
  /** False when it is another teacher's period of a class you teach. */
  is_my_period: boolean;
  session_id: string | null;
  submitted_at: string | null;
  /** Who last saved the register. */
  marked_by_name: string | null;
  students: RegisterStudent[];
};

export type TodayRegistersResponse = {
  date: string;
  day_of_week: string;
  registers: AttendanceRegister[];
};

export type SaveRegisterPayload = {
  teacher_assignment_id: string;
  /** "YYYY-MM-DD" */
  attendance_date: string;
  period_number: number;
  attendances: Array<{
    student_enrollment_id: string;
    status: ApiAttendanceStatus;
    remarks?: string | null;
  }>;
};

export type RecordStudent = {
  enrollment_id: string;
  student_profile_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  roll_number: string;
  /** "YYYY-MM-DD" → day status rolled up from every period of the class. */
  days: Record<string, DayStatus>;
  /** "YYYY-MM-DD" → periods marked that day. */
  periods_marked: Record<string, number>;
  periods_attended: number;
  absent_days: number;
  marked_days: number;
  attendance_percent: number | null;
};

export type AttendanceRecordsResponse = {
  section_id: string;
  class_name: string;
  section_name: string;
  /** "YYYY-MM" */
  month: string;
  dates: string[];
  students: RecordStudent[];
};

/*
 * UI statuses.
 */

export type MarkStatus = "present" | "absent" | "late" | "half_day" | "leave";

export const markLabels: Record<MarkStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half day",
  leave: "On leave",
};

export const toMarkStatus: Record<ApiAttendanceStatus, MarkStatus> = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HALF_DAY: "half_day",
  LEAVE: "leave",
};

export const toApiStatus: Record<MarkStatus, ApiAttendanceStatus> = {
  present: "PRESENT",
  absent: "ABSENT",
  late: "LATE",
  half_day: "HALF_DAY",
  leave: "LEAVE",
};
