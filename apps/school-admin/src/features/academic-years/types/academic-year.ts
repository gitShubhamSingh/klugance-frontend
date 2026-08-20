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