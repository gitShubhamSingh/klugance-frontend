export type TeacherStatus =
  | "active"
  | "inactive";

export type Teacher = {
  id: string;

  user_id: string;
  school_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  email: string;
  mobile_number: string;

  employee_code: string;

  joining_date: string | null;

  qualification: string | null;

  experience_years: number | null;

  bio: string | null;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
};