export interface School {
    id: string;
    name: string;
    code: string;
    email: string;
    mobile_number: string;
    website: string;
    address: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
  }
  
  export interface CreateSchoolRequest {
    name: string;
    code: string;
    email?: string;
    mobile_number?: string;
    website?: string;
    address?: string;
    description?: string;
  }
  