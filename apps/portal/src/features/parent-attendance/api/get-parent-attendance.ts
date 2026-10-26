import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";
import type { StudentAttendance } from "@/features/student/types/student";

/** Day-wise and period-wise attendance of a child linked to the signed-in parent. */
export async function getParentAttendance(
  studentId: string,
  date: string,
  month: string,
): Promise<StudentAttendance> {
  const { data } = await apiClient.get<ApiResponse<StudentAttendance>>(
    API_ENDPOINTS.PARENT.ATTENDANCE,
    { params: { student_id: studentId, date, month } },
  );

  return data.data;
}
