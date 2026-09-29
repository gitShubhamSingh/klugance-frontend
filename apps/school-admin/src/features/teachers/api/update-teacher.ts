import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";
import type { Teacher } from "../types";

export type UpdateTeacherPayload = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  mobile_number: string;
  joining_date: string;
  employee_code: string;
  qualification: string | null;
  experience_years: number | null;
  bio: string | null;
};

export async function updateTeacher(
  teacherId: string,
  payload: UpdateTeacherPayload,
): Promise<Teacher> {
  const { data } =
    await apiClient.put<ApiResponse<Teacher>>(
      API_ENDPOINTS.TEACHERS.UPDATE(teacherId),
      payload,
    );

  return data.data;
}