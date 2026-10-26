import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { TeacherStudentsApiResponse } from "../types/teacher-students";

/**
 * Students in the signed-in teacher's sections. The server resolves the
 * teacher from the session; no teacher id is sent.
 *
 * @param date the teacher's local date ("YYYY-MM-DD") for "present today".
 */
export async function getTeacherStudents(
  date: string,
): Promise<TeacherStudentsApiResponse> {
  const { data } = await apiClient.get<
    ApiResponse<TeacherStudentsApiResponse>
  >(API_ENDPOINTS.TEACHER.STUDENTS, {
    params: { date },
  });

  return data.data;
}
