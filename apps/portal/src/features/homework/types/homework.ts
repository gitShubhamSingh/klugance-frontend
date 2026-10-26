/*
 * Teacher homework API shapes — mirror backend_v2
 * app/modules/homework/schemas/teacher_homework_schemas.py.
 * Student / parent shapes live in features/student/types/student.ts.
 */

export type HomeworkTargetType = "CLASS" | "SECTION" | "STUDENTS";
export type HomeworkStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";
export type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "LATE" | "REVIEWED" | "REJECTED" | "PENDING";

export type HomeworkSectionOption = { section_id: string; section_name: string; student_count: number };
export type HomeworkSubjectOption = { subject_id: string; subject_name: string; sections: HomeworkSectionOption[] };
export type HomeworkClassOption = { class_id: string; class_name: string; subjects: HomeworkSubjectOption[] };

export type HomeworkStudentOption = {
  enrollment_id: string;
  name: string;
  roll_number: string;
  admission_number: string;
};

export type CreateHomeworkPayload = {
  target_type: HomeworkTargetType;
  class_id: string;
  subject_id: string;
  section_id: string | null;
  student_enrollment_ids: string[];
  title: string;
  description: string;
  instructions: string | null;
  assigned_date: string;
  due_date: string;
  max_marks: number;
  allow_late_submission: boolean;
  attachment_url: string | null;
};

export type HomeworkStats = {
  recipients: number;
  pending_review: number;
  checked: number;
  rejected: number;
  not_submitted: number;
};

export type TeacherHomework = {
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
};

export type TeacherHomeworkSubmission = {
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

export type TeacherHomeworkDetail = TeacherHomework & { submissions: TeacherHomeworkSubmission[] };

export type ReviewPayload = {
  decision: "CHECKED" | "REJECTED";
  marks: number | null;
  remark: string | null;
};

/* ── AI question generation (draft only — nothing is saved yet) ── */

export type GeneratedQuestionType = "OBJECTIVE" | "FILL_IN_THE_BLANK" | "SHORT" | "LONG";

export type QuestionCounts = {
  objective_count: number;
  fill_in_the_blank_count: number;
  short_count: number;
  long_count: number;
};

export type GenerateQuestionsPayload = QuestionCounts & {
  class_id: string;
  subject_id: string;
  topic: string | null;
};

export type GeneratedQuestion = {
  id: string;
  type: GeneratedQuestionType;
  question: string;
  options: string[];
  answer: string | null;
  marks: number;
};

export type GeneratedQuestionPaper = {
  topic: string | null;
  questions: GeneratedQuestion[];
  total_marks: number;
};
