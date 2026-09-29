export interface AcademicYear {
    id: string;
    school_id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
  }
  
  export interface CreateAcademicYearPayload {
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
  }
  
  export interface UpdateAcademicYearPayload {
    name: string;
    start_date: string;
    end_date: string;
  }

  export type AcademicYearsApiResponse = {
    success: boolean;
    status_code: number;
    message: string;
  
    data: AcademicYear | AcademicYear[];
    errors: unknown[];
    meta: unknown;
    timestamp: string;
    trace_id: string | null;
    encrypted: boolean;
    algorithm: string | null;
    version: string;
  };