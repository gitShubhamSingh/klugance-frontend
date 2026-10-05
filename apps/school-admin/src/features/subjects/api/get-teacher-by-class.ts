import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { SubjectClassTeacher } from "../types/subject-class-teacher";

export async function getTeachersByClass(
  classId: string,
): Promise<SubjectClassTeacher[]> {
  const { data } = await apiClient.get<
    ApiResponse<SubjectClassTeacher[]>
  >(
    API_ENDPOINTS.SUBJECTS.TEACHERS_BY_CLASS(classId),
  );

  return data.data ?? [];
}