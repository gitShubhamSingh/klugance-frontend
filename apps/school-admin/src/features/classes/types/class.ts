export interface SchoolClass {
  id: string;
  school_id: string;
  academic_year_id: string;
  name: string;
  code: string;
  description: string | null;
  display_order: number;
}

export interface CreateClassPayload {
  academic_year_id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface UpdateClassPayload {
  name: string;
  code: string;
  description: string | null;
}