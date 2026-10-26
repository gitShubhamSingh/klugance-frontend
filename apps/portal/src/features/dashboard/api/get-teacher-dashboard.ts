import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { TeacherDashboard } from "../types/teacher-dashboard";

/**
 * @param date the teacher's local date ("YYYY-MM-DD"), so "today"
 * on the server matches the day the teacher is looking at.
 */
export async function getTeacherDashboard(
  date: string,
): Promise<TeacherDashboard> {
  const { data } = await apiClient.get<
    ApiResponse<TeacherDashboard>
  >(API_ENDPOINTS.TEACHER.DASHBOARD, {
    params: { date },
  });

  return data.data;
}
