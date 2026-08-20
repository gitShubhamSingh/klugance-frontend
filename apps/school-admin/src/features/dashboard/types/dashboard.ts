export interface AcademicYearSummary {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  }
  
  export interface DashboardSummary {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    total_sections: number;
  }
  
  export interface SchoolDashboard {
    school_id: string;
    school_name: string;
    school_code: string;
  
    academic_year: AcademicYearSummary | null;
  
    summary: DashboardSummary;
  }