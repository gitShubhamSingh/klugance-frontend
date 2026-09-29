import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type TeacherClassAssignment = {
  id: string;
  teacher_profile_id: string;
  class_id: string;
  created_at: string;
  updated_at: string;
};

export async function getTeacherClassAssignments(
  teacherId: string,
): Promise<TeacherClassAssignment[]> {
  const { data } = await apiClient.get<
    ApiResponse<TeacherClassAssignment[]>
  >(
    API_ENDPOINTS.TEACHER_CLASS_ASSIGNMENTS.LIST_BY_TEACHER(
      teacherId,
    ),
  );

  return data.data ?? [];
}