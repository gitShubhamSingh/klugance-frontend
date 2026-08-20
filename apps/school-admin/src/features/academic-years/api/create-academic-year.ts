import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type {
  AcademicYear,
  CreateAcademicYearPayload,
} from "../types";

export async function createAcademicYear(
  payload: CreateAcademicYearPayload,
): Promise<AcademicYear> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.ACADEMIC_YEARS.CREATE,
    payload,
  );

  return data.data;
}