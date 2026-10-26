import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { TeacherTimetableApiResponse } from "../types/teacher-timetable";

/** The signed-in teacher's weekly timetable (resolved from the session). */
export async function getTeacherTimetable(): Promise<TeacherTimetableApiResponse> {
  const { data } = await apiClient.get<
    ApiResponse<TeacherTimetableApiResponse>
  >(API_ENDPOINTS.TEACHER.TIMETABLE);

  return data.data;
}
