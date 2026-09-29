export type StudentGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export type StudentBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";

  export type Student = {
    id: string;
    user_id: string;
    school_id: string;
  
    first_name: string;
    middle_name: string | null;
    last_name: string;
  
    email: string;
    mobile_number: string;
  
    admission_number: string;
  
    date_of_birth: string | null;
    gender: string | null;
    blood_group: string | null;
    admission_date: string | null;
  
    is_active: boolean;
  
    class_name?: string | null;
    section_name?: string | null;
  };