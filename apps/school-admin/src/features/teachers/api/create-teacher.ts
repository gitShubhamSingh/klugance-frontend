import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { Teacher } from "../types";
import type { TeacherFormData } from "../schemas/teacher.schema";

export async function createTeacher(
  payload: TeacherFormData,
): Promise<Teacher> {
  const { data } =
    await apiClient.post<
      ApiResponse<Teacher>
    >(
      API_ENDPOINTS.TEACHERS.CREATE,
      payload,
    );

  if (!data.data) {
    throw new Error(
      "Teacher data is unavailable.",
    );
  }

  return data.data;
}