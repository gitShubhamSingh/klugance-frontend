export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }
  
  export interface RefreshRequest {
    refresh_token: string;
  }
  
  export interface RefreshResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }
  
  export interface CurrentUser {
    id: string;
    email: string;
    full_name: string;
    avatar?: string | null;
    role: string;
  }