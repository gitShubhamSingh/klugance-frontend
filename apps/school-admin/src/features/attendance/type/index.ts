export type AttendanceStatus =
  | "present"
  | "absent"
  | "not_marked";

export type AttendanceStudent = {
  id: string;

  roll_number: number;

  admission_number: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  class_name: string;
  section_name: string;

  status: AttendanceStatus;
};

export type AttendanceClass = {
  class_name: string;
  section_name: string;

  date: string;

  students: AttendanceStudent[];
};