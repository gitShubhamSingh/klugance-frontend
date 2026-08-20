export type SchoolAdminStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "LOCKED"
  | "SUSPENDED"
  | "ARCHIVED";

export interface SchoolAdminSchool {
  id: string;
  name: string;
  code: string;
}

export interface SchoolAdminRole {
  id: string;
  name: string;
  code: string;
}

export interface SchoolAdmin {
  id: string;

  email: string;
  mobile_number: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  profile_picture: string | null;

  status: SchoolAdminStatus;

  last_login_at: string | null;

  school: SchoolAdminSchool;

  roles: SchoolAdminRole[];

  joined_at: string | null;

  is_deleted: boolean;
  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}