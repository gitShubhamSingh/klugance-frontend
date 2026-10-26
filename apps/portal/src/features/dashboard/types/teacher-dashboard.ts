/*
 * Mirrors backend_v2 `TeacherDashboardResponse`
 * (app/modules/dashboard/schemas/teacher_dashboard_response.py).
 */

export type TeacherDashboardProfile = {
  id: string;
  user_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  employee_code: string;
  qualification: string | null;

  subjects: string[];
  /** "Class 8 – B" for every section the teacher teaches. */
  classes: string[];
};

export type TeacherDashboardPeriod = {
  timetable_entry_id: string;
  teacher_assignment_id: string;

  period_id: string;
  period_name: string;
  /** 1-based position in the section's day; attendance `period_number`. */
  period_number: number;

  /** 24h "HH:MM" */
  start_time: string;
  end_time: string;

  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;

  student_count: number;
  attendance_marked: boolean;
  students_present: number | null;
};

export type TeacherDashboardSummary = {
  classes_today: number;
  attendance_pending_today: number;

  total_students: number;
  total_sections: number;
  total_subjects: number;

  homework_to_review: number;

  /** Last 30 days; null when no attendance was marked. */
  avg_attendance_percent: number | null;
  /** The 30 days before that. */
  previous_attendance_percent: number | null;
};

export type TeacherDashboardClassPerformance = {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;

  student_count: number;

  avg_score_percent: number | null;
  attendance_percent: number | null;
};

export type TeacherDashboard = {
  /** "YYYY-MM-DD" */
  date: string;
  day_of_week: string;

  school_id: string;
  academic_year: { id: string; name: string } | null;

  teacher: TeacherDashboardProfile;
  summary: TeacherDashboardSummary;

  /** Sorted by start time. */
  today_schedule: TeacherDashboardPeriod[];
  class_performance: TeacherDashboardClassPerformance[];
};
