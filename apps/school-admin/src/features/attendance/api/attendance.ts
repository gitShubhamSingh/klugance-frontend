import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { AttendanceOverview, SectionAttendance } from "../types/attendance";

/* Admin-only and scoped to the signed-in admin's school on the server. */

export async function getAttendanceOverview(date: string): Promise<AttendanceOverview> {
  const { data } = await apiClient.get<ApiResponse<AttendanceOverview>>(API_ENDPOINTS.ATTENDANCE.OVERVIEW, {
    params: { date },
  });
  return data.data;
}

export async function getSectionAttendance(sectionId: string, date: string): Promise<SectionAttendance> {
  const { data } = await apiClient.get<ApiResponse<SectionAttendance>>(API_ENDPOINTS.ATTENDANCE.SECTION(sectionId), {
    params: { date },
  });
  return data.data;
}
