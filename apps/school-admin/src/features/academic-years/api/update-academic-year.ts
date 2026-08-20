import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type {
  AcademicYear,
  UpdateAcademicYearPayload,
} from "../types";

export async function updateAcademicYear(
  id: string,
  payload: UpdateAcademicYearPayload,
): Promise<AcademicYear> {
  const { data } = await apiClient.put(
    API_ENDPOINTS.ACADEMIC_YEARS.UPDATE(id),
    payload,
  );

  return data.data;
}