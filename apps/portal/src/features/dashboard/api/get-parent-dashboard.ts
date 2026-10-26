import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { ParentDashboard } from "../types/parent-dashboard";

/**
 * Dashboard for one child; the server checks the child is linked to the
 * signed-in parent. `date` is the parent's local "YYYY-MM-DD".
 */
export async function getParentDashboard(studentId: string, date: string): Promise<ParentDashboard> {
  const { data } = await apiClient.get<ApiResponse<ParentDashboard>>(
    API_ENDPOINTS.PARENT.DASHBOARD,
    { params: { student_id: studentId, date } },
  );

  return data.data;
}
