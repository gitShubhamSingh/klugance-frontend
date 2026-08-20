export interface CreateSchoolAdminRequest {
    school_id: string;
    role_code: string;
  
    email: string;
    mobile_number: string;
    password: string;
  
    first_name: string;
    middle_name?: string;
    last_name: string;
  }