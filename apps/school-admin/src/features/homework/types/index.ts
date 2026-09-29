export type HomeworkStatus =
  | "active"
  | "due_soon"
  | "overdue"
  | "completed";

export type Homework = {
  id: string;

  title: string;
  description: string;

  subject: string;

  class_name: string;
  section_name: string;

  teacher_name: string;

  assigned_date: string;
  due_date: string;

  total_students: number;
  submitted_students: number;

  status: HomeworkStatus;
};