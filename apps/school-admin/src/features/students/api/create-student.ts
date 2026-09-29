import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  Student,
  StudentBloodGroup,
  StudentGender,
} from "../types";

export type CreateStudentPayload = {
  first_name: string;
  middle_name: string | null;
  last_name: string;

  email: string;
  mobile_number: string;

  admission_number: string;

  date_of_birth: string | null;

  gender: StudentGender | null;

  blood_group: StudentBloodGroup | null;

  admission_date: string | null;
};

export async function createStudent(
  payload: CreateStudentPayload,
): Promise<Student> {
  const { data } =
    await apiClient.post<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.CREATE,
      payload,
    );

  return data.data;
}