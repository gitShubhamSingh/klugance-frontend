import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { AcademicYear, AcademicYearsApiResponse } from "../types";

export async function getAcademicYears(): Promise<
  AcademicYear | null
> {
  const response = await apiClient.get<AcademicYearsApiResponse>(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST,
  );

  return response.data.data ?? null;
}