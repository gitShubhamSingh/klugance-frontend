import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  TimetableGridData,
} from "../types/timetable-grid";

export async function getTimetableGrid(
  classId: string,
  sectionId: string,
): Promise<TimetableGridData> {
  const { data } = await apiClient.get<
    ApiResponse<TimetableGridData>
  >(
    API_ENDPOINTS.TIMETABLES.GRID(
      classId,
      sectionId,
    ),
  );

  return data.data;
}