import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { TimetableTeacher } from "../types/timetable-teacher";

export async function getClassTeachers(
  classId: string,
): Promise<TimetableTeacher[]> {
  const { data } = await apiClient.get<
    ApiResponse<TimetableTeacher[]>
  >(
    API_ENDPOINTS.TIMETABLES.CLASS_TEACHERS(
      classId,
    ),
  );

  return data.data ?? [];
}