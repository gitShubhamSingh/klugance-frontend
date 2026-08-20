import type {
    SchoolAdminStatus,
  } from "./school-admin";
  
  export interface UpdateSchoolAdminRequest {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    mobile_number: string;
    profile_picture: string | null;
    status: SchoolAdminStatus;
  }