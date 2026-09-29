import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type AssignTeachersRequest = {
  class_id: string;
  teacher_ids: string[];
};

export type TeacherClassAssignment = {
  id: string;
  teacher_profile_id: string;
  class_id: string;
  created_at: string;
  updated_at: string | null;
};

export async function assignTeachers(
  payload: AssignTeachersRequest,
): Promise<TeacherClassAssignment[]> {
  const { data } = await apiClient.post<
    ApiResponse<TeacherClassAssignment[]>
  >(
    API_ENDPOINTS.TEACHER_CLASS_ASSIGNMENTS.CREATE,
    payload,
  );

  return data.data ?? [];
}