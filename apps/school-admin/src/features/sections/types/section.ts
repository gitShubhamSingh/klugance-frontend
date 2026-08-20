export interface SchoolSection {
    id: string;
    class_id: string;
    name: string;
    code: string;
  }
  
  export interface CreateSectionPayload {
    class_id: string;
    name: string;
    code: string;
  }
  
  export interface UpdateSectionPayload {
    name: string;
    code: string;
  }