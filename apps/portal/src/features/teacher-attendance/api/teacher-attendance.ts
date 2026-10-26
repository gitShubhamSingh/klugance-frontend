import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  AttendanceRecordsResponse,
  AttendanceRegister,
  SaveRegisterPayload,
  TodayRegistersResponse,
} from "../types/teacher-attendance";

/** Today's timetabled periods (registers) for the signed-in teacher. */
export async function getTodayRegisters(date: string): Promise<TodayRegistersResponse> {
  const { data } = await apiClient.get<ApiResponse<TodayRegistersResponse>>(
    API_ENDPOINTS.TEACHER.ATTENDANCE_TODAY,
    { params: { date } },
  );

  return data.data;
}

/** Creates or updates one register; the server checks it is the teacher's own period. */
export async function saveRegister(payload: SaveRegisterPayload): Promise<AttendanceRegister> {
  const { data } = await apiClient.put<ApiResponse<AttendanceRegister>>(
    API_ENDPOINTS.TEACHER.ATTENDANCE_REGISTERS,
    payload,
  );

  return data.data;
}

/** One section's register for a month ("YYYY-MM"). */
export async function getAttendanceRecords(
  sectionId: string,
  month: string,
): Promise<AttendanceRecordsResponse> {
  const { data } = await apiClient.get<ApiResponse<AttendanceRecordsResponse>>(
    API_ENDPOINTS.TEACHER.ATTENDANCE_RECORDS,
    { params: { section_id: sectionId, month } },
  );

  return data.data;
}
