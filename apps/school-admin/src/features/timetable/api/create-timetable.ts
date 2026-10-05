import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type CreateTimetablePayload = {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  teacher_assignment_id: string;
  period_id: string;
  day_of_week: string;
  effective_from: string;
  effective_to: string;
};

export type TimetableEntry = {
  id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  teacher_assignment_id: string;
  period_id: string;
  day_of_week: string;
  effective_from: string;
  effective_to: string;
};

export async function createTimetable(
  payload: CreateTimetablePayload,
): Promise<TimetableEntry> {
  const { data } = await apiClient.post<
    ApiResponse<TimetableEntry>
  >(
    API_ENDPOINTS.TIMETABLES.CREATE,
    payload,
  );

  return data.data;
}