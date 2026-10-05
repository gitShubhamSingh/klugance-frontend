import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type SubjectTeacherAssignment = {
  id: string;
  teacher_profile_id: string;
  subject_id: string;
};

export async function getSubjectTeacherAssignments(
  subjectId: string,
): Promise<SubjectTeacherAssignment[]> {
  const { data } = await apiClient.get<
    ApiResponse<SubjectTeacherAssignment[]>
  >(
    API_ENDPOINTS.SUBJECTS.TEACHER_ASSIGNMENTS_BY_SUBJECT(
      subjectId,
    ),
  );

  return data.data ?? [];
}