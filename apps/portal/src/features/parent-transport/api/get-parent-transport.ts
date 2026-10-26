import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";
import type { ParentTransport } from "@/features/dashboard/types/parent-dashboard";

/** Bus, route and today's trips for a child linked to the signed-in parent. */
export async function getParentTransport(studentId: string, date: string): Promise<ParentTransport> {
  const { data } = await apiClient.get<ApiResponse<ParentTransport>>(
    API_ENDPOINTS.PARENT.TRANSPORT,
    { params: { student_id: studentId, date } },
  );

  return data.data;
}
