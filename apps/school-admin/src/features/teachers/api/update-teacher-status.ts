import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";
import type { Teacher } from "../types";

export type UpdateTeacherStatusPayload = {
  is_active: boolean;
};

export async function updateTeacherStatus(
  teacherId: string,
  payload: UpdateTeacherStatusPayload,
): Promise<Teacher> {
  const { data } =
    await apiClient.patch<ApiResponse<Teacher>>(
      API_ENDPOINTS.TEACHERS.UPDATE(teacherId),
      payload,
    );

  return data.data;
}