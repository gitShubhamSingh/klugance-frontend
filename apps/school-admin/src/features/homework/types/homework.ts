/*
 * API shapes — mirror backend_v2
 * app/modules/homework/schemas/school_homework_schemas.py.
 */

export type HomeworkTargetType = "CLASS" | "SECTION" | "STUDENTS";
export type HomeworkStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";
export type SubmissionStatus = "NOT_SUBMITTED" | "PENDING" | "SUBMITTED" | "LATE" | "REVIEWED" | "REJECTED";

export type HomeworkStats = {
  recipients: number;
  pending_review: number;
  checked: number;
  rejected: number;
  not_submitted: number;
};

export type SchoolHomework = {
  id: string;
  group_id: string | null;
  target_type: HomeworkTargetType;
  status: HomeworkStatus;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
  title: string;
  description: string;
  instructions: string | null;
  assigned_date: string;
  due_date: string;
  max_marks: number;
  allow_late_submission: boolean;
  attachment_url: string | null;
  stats: HomeworkStats;
  teacher_name: string | null;
  is_overdue: boolean;
};

export type HomeworkSubmission = {
  enrollment_id: string;
  name: string;
  roll_number: string;
  admission_number: string;
  status: SubmissionStatus;
  submission_text: string | null;
  attachment_url: string | null;
  submitted_at: string | null;
  submitted_by_role: "STUDENT" | "PARENT" | null;
  submitted_by_name: string | null;
  is_late: boolean;
  marks: number | null;
  teacher_remark: string | null;
  reviewed_at: string | null;
};

export type SchoolHomeworkDetail = SchoolHomework & { submissions: HomeworkSubmission[] };

export type HomeworkOverview = {
  total: number;
  active: number;
  closed: number;
  cancelled: number;
  overdue: number;
  assigned_to: number;
  handed_in: number;
  pending_review: number;
  checked: number;
  rejected: number;
  not_submitted: number;
};

export type SchoolHomeworkList = { overview: HomeworkOverview; homework: SchoolHomework[] };

export type HomeworkActivity = {
  type: "ASSIGNED" | "SUBMITTED" | "CHECKED" | "REJECTED";
  /** UTC ISO timestamp (no zone suffix). */
  at: string;
  homework_id: string;
  title: string;
  class_name: string;
  section_name: string;
  subject_name: string;
  actor_name: string | null;
  actor_role: "TEACHER" | "STUDENT" | "PARENT" | null;
  student_name: string | null;
  detail: string | null;
};
