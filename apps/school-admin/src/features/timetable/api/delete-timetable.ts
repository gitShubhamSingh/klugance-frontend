import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deleteTimetable(
  timetableId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.TIMETABLES.DELETE(
      timetableId,
    ),
  );
}