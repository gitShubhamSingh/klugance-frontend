export type TimetableStatus =
  | "draft"
  | "published"
  | "archived";

export type TimetableDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type TimetableEntry = {
  id: string;

  day: TimetableDay;

  period_number: number;

  start_time: string;
  end_time: string;

  subject: string;

  teacher: string;

  room: string | null;

  is_break?: boolean;
};

export type TimetableVersion = {
  id: string;

  name: string;

  academic_year: string;

  class_name: string;

  section_name: string;

  status: TimetableStatus;

  effective_from: string;

  effective_to: string | null;

  entries: TimetableEntry[];
};