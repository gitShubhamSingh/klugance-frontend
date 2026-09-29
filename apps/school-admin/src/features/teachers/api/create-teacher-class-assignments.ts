import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export type CreateTeacherClassAssignmentPayload = {
  teacher_ids: string[];
  class_id: string;
};

export async function createTeacherClassAssignment(
  payload: CreateTeacherClassAssignmentPayload,
): Promise<void> {
  await apiClient.post(
    API_ENDPOINTS.TEACHER_CLASS_ASSIGNMENTS.CREATE,
    payload,
  );
}