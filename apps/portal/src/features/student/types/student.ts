import type { DayStatusValue, ParentPeriod, PeriodMark } from "@/features/dashboard/types/parent-dashboard";
import type { ParentChild } from "@/features/parent-children";

/*
 * Mirrors the backend_v2 student-portal schemas
 * (attendance, homework, exams, timetable and dashboard modules).
 */

export type StudentProfile = ParentChild;

/* ── attendance ── */

export type AttendanceSummary = {
  /** Days, by rolled-up day status. */
  present: number;
  late: number;
  partial: number;
  absent: number;
  leave: number;
  marked_days: number;
  /** Periods. */
  periods_marked: number;
  periods_attended: number;
  /** Period-based. */
  attendance_percent: number | null;
};

export type AttendanceDay = {
  date: string;
  status: DayStatusValue;
  periods: PeriodMark[];
};

export type StudentAttendance = {
  date: string;
  /** "YYYY-MM" */
  month: string;
  year: AttendanceSummary;
  month_summary: AttendanceSummary;
  /** "YYYY-MM-DD" → day status */
  days: Record<string, DayStatusValue>;
  /** Period-wise detail of each marked day in the month, newest first. */
  day_details: AttendanceDay[];
  today_status: DayStatusValue | null;
  today: AttendanceDay | null;
};

/* ── homework ── */

export type SubmissionStatus = "NOT_SUBMITTED" | "PENDING" | "SUBMITTED" | "LATE" | "REVIEWED" | "REJECTED";

export type StudentHomeworkItem = {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  subject_name: string;
  teacher_name: string | null;
  assigned_date: string;
  due_date: string;
  max_marks: number;
  allow_late_submission: boolean;
  attachment_url: string | null;
  homework_status: "PUBLISHED" | "CLOSED";
  submission_status: SubmissionStatus;
  submitted_at: string | null;
  marks: number | null;
  teacher_remark: string | null;
  is_overdue: boolean;

  /** What students and parents see. */
  display_status: HomeworkDisplayStatus;
  submission_text: string | null;
  submission_attachment_url: string | null;
  submitted_by_role: "STUDENT" | "PARENT" | null;
  submitted_by_name: string | null;
  is_late: boolean;
  can_submit: boolean;
  submit_blocked_reason: string | null;
};

/** PENDING = handed in, waiting for the teacher; REJECTED = fix and resubmit. */
export type HomeworkDisplayStatus = "NOT_SUBMITTED" | "PENDING" | "CHECKED" | "REJECTED";

export type StudentHomeworkSummary = {
  total: number;
  to_do: number;
  overdue: number;
  submitted: number;
  reviewed: number;
  pending: number;
  rejected: number;
};

export type SubmitHomeworkPayload = {
  submission_text: string | null;
  attachment_url: string | null;
};

export type StudentHomework = {
  summary: StudentHomeworkSummary;
  items: StudentHomeworkItem[];
};

/* ── exams ── */

export type UpcomingExam = {
  exam_id: string;
  exam_name: string;
  exam_subject_id: string;
  subject_name: string;
  exam_date: string;
  days_left: number;
  max_marks: number;
  pass_marks: number;
};

export type SubjectResult = {
  subject_name: string;
  exam_date: string | null;
  max_marks: number;
  pass_marks: number;
  marks_obtained: number | null;
  passed: boolean | null;
  remarks: string | null;
  section_average_percent: number | null;
};

export type ExamResult = {
  exam_id: string;
  exam_name: string;
  start_date: string | null;
  end_date: string | null;
  subjects: SubjectResult[];
  total_obtained: number;
  total_max: number;
  percentage: number | null;
  report_card: {
    total_marks: number;
    obtained_marks: number;
    percentage: number;
    grade: string;
    result_status: string;
  } | null;
};

export type SubjectScore = {
  subject_name: string;
  score_percent: number;
  section_average_percent: number | null;
};

export type StudentExams = {
  upcoming: UpcomingExam[];
  results: ExamResult[];
  subject_scores: SubjectScore[];
};

/* ── timetable ── */

export type StudentTimetableEntry = {
  timetable_entry_id: string;
  /** "MONDAY" … "SUNDAY" */
  day_of_week: string;
  period_name: string;
  /** 24h "HH:MM" */
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string | null;
};

export type StudentTimetable = {
  class_name: string | null;
  section_name: string | null;
  entries: StudentTimetableEntry[];
};

/* ── dashboard ── */

export type StudentDashboard = {
  date: string;
  student: StudentProfile;
  /** Period-based, this academic year. */
  attendance_percent: number | null;
  today_status: DayStatusValue | null;
  today_periods: PeriodMark[];
  /** Monday → Sunday of the current week. */
  week: Array<{ date: string; status: DayStatusValue | null }>;
  avg_score_percent: number | null;
  subject_scores: SubjectScore[];
  upcoming_exams: UpcomingExam[];
  homework_summary: StudentHomeworkSummary;
  homework: StudentHomeworkItem[];
  today_schedule: ParentPeriod[];
};
