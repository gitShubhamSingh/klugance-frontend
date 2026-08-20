import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { AcademicYear } from "../types";

export async function getAcademicYears(): Promise<
  AcademicYear[]
> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST,
  );

  return data.data;
}