/* Mirrors backend_v2 `TeacherOwnProfileResponse`. */
export type TeacherOwnProfile = {
  id: string;
  employee_code: string;
  /** "YYYY-MM-DD" */
  joining_date: string | null;
  qualification: string | null;
  experience_years: number | null;
  bio: string | null;
  is_active: boolean;
};
