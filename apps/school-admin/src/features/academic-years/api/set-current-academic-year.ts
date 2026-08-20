import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { ApiResponse } from "@/core/api/types/api-response";

import type { AcademicYear } from "../types";

export async function setCurrentAcademicYear(
  academicYearId: string,
): Promise<AcademicYear> {
  const { data } = await apiClient.patch<
    ApiResponse<AcademicYear>
  >(
    API_ENDPOINTS.ACADEMIC_YEARS.SET_CURRENT(
      academicYearId,
    ),
  );

  if (!data.data) {
    throw new Error(
      "Academic year data is unavailable.",
    );
  }

  return data.data;
}