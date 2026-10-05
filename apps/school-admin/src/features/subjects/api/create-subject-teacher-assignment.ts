import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type CreateSubjectTeacherAssignmentPayload = {
  subject_id: string;
  teacher_ids: string[];
};

export async function createSubjectTeacherAssignment(
  payload: CreateSubjectTeacherAssignmentPayload,
) {
  const { data } =
    await apiClient.post<
      ApiResponse<unknown>
    >(
      API_ENDPOINTS.SUBJECTS.TEACHER_ASSIGNMENTS,
      payload,
    );

  return data.data;
}