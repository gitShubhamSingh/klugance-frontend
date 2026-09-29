export interface SchoolClass {
  id: string;

  school_id: string;

  academic_year_id: string;

  name: string;

  code: string;

  description: string | null;

  display_order: number;

  /*
   * =====================================================
   * CLASS STATISTICS
   *
   * These will be populated later by the backend.
   * Optional for now so the current API continues working.
   * =====================================================
   */

  teachers_count?: number;

  subjects_count?: number;

  sections_count?: number;
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