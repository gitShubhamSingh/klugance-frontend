import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { AcademicYear } from "../types";

export async function getAcademicYear(
  id: string,
): Promise<AcademicYear> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.ACADEMIC_YEARS.DETAIL(id),
  );

  return data.data;
}