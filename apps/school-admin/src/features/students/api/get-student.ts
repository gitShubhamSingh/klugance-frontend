import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { Student } from "../types";

export async function getStudent(
  studentId: string,
): Promise<Student> {
  const { data } =
    await apiClient.get<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.DETAIL(studentId),
    );

  return data.data;
}