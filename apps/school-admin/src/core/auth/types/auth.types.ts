export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
  
  export type UserStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "LOCKED"
    | "SUSPENDED"
    | "ARCHIVED";
  
  export interface CurrentUserSchool {
    id: string;
    name: string;
    code: string;
  }
  
  export interface CurrentUserRole {
    id: string;
    name: string;
    code: string;
  }
  
  export interface CurrentUser {
    id: string;
  
    email: string;
    mobile_number: string;
  
    first_name: string;
    middle_name: string | null;
    last_name: string;
  
    profile_picture: string | null;
  
    status: UserStatus;
  
    school: CurrentUserSchool | null;
  
    roles: CurrentUserRole[];
  }