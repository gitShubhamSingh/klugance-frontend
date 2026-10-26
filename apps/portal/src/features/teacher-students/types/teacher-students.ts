import type { Tone } from "@/features/dashboard/lib/tones";

/*
 * API shapes — mirror backend_v2 `TeacherStudentsResponse`
 * (app/modules/people/schemas/teacher_student_response.py).
 */

export type TeacherStudentsApiSection = {
  section_id: string;
  class_id: string;
  class_name: string;
  section_name: string;
  subjects: string[];
  /** "MONDAY" … "SUNDAY" */
  schedule_days: string[];
  periods_per_week: number;
  student_count: number;
};

export type TeacherStudentsApiScore = {
  exam_id: string;
  exam_name: string;
  exam_date: string | null;
  score_percent: number;
};

export type TeacherStudentsApiGuardian = {
  /** Portal user, e.g. to open a chat with them. */
  user_id: string;
  name: string;
  mobile_number: string;
  relationship_type: string;
  is_primary_contact: boolean;
};

export type TeacherStudentsApiStudent = {
  student_profile_id: string;
  enrollment_id: string;
  user_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  admission_number: string;
  roll_number: string;

  gender: "MALE" | "FEMALE" | "OTHER" | null;
  date_of_birth: string | null;

  section_id: string;
  class_name: string;
  section_name: string;

  /** null = no data yet (nothing marked / graded). */
  attendance_percent: number | null;
  avg_score_percent: number | null;
  score_trend: number | null;
  homework_rate: number | null;

  /** null = attendance not marked yet today. */
  present_today: boolean | null;

  scores: TeacherStudentsApiScore[];
  guardian: TeacherStudentsApiGuardian | null;
};

export type TeacherStudentsApiResponse = {
  date: string;
  academic_year_id: string | null;
  academic_year_name: string | null;
  sections: TeacherStudentsApiSection[];
  students: TeacherStudentsApiStudent[];
};

/*
 * View models used by the My Students components.
 */

export type Gender = "M" | "F" | "O";

export type ClassSection = {
  id: string;
  name: string;
  shortName: string;
  subject: string;
  schedule: string;
  strength: number;
  tone: Tone;
};

export type TestScore = {
  test: string;
  score: number;
};

export type TeacherStudent = {
  /** student_profile_id */
  id: string;
  /** Portal user, for messaging. */
  userId: string;
  enrollmentId: string;
  name: string;
  rollNo: string;
  admissionNumber: string;
  sectionId: string;
  gender: Gender | null;

  attendance: number | null;
  avgScore: number | null;
  /** Change in percentage points vs previous test. */
  trend: number | null;
  homeworkRate: number | null;
  presentToday: boolean | null;

  parentName: string | null;
  parentPhone: string | null;
  parentUserId: string | null;

  /** "Oct 24" when the birthday falls in the next 7 days. */
  birthday: string | null;

  scores: TestScore[];
};

export type TeacherStudentsData = {
  date: string;
  academicYearName: string | null;
  sections: ClassSection[];
  students: TeacherStudent[];
};
