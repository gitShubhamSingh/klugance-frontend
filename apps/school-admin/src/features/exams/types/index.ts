export type ExamStatus =
  | "draft"
  | "scheduled"
  | "ongoing"
  | "completed"
  | "results_ready"
  | "published"
  | "cancelled";

export type ExamType =
  | "unit_test"
  | "mid_term"
  | "half_yearly"
  | "final"
  | "pre_board"
  | "entrance";

export type Exam = {
  id: string;

  name: string;

  academic_year: string;

  type: ExamType;

  status: ExamStatus;

  start_date: string;

  end_date: string;

  subject_count: number;

  class_count: number;

  student_count: number;

  marks_entered: number;

  marks_reviewed: number;

  results_published: boolean;

  created_at: string;

  updated_at: string;
};