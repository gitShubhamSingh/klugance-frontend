import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { Student } from "../types";

export type UpdateStudentPayload = {
  first_name: string;
  middle_name: string | null;
  last_name: string;

  email: string;
  mobile_number: string;

  date_of_birth: string | null;

  gender:
    | "MALE"
    | "FEMALE"
    | "OTHER"
    | null;

  blood_group:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "O+"
    | "O-"
    | "AB+"
    | "AB-"
    | null;

  admission_date: string | null;
};

export async function updateStudent(
  studentId: string,
  payload: UpdateStudentPayload,
): Promise<Student> {
  const { data } =
    await apiClient.put<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.UPDATE(studentId),
      payload,
    );

  return data.data;
}