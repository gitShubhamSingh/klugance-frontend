import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type TeacherAssignment = {
  id: string;
  teacher_profile_id: string;
  class_subject_id: string;
  section_id: string;
  academic_year_id: string;
};

export async function getTeacherAssignments(): Promise<
  TeacherAssignment[]
> {
  const { data } = await apiClient.get<
    ApiResponse<TeacherAssignment[]>
  >(
    API_ENDPOINTS.TEACHER_ASSIGNMENTS.LIST,
  );

  return data.data ?? [];
}