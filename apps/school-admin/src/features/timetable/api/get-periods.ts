import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { Period } from "../types/period";

export async function getPeriods(): Promise<Period[]> {
  const { data } = await apiClient.get<ApiResponse<Period[]>>(
    API_ENDPOINTS.PERIODS.LIST,
  );

  return data.data ?? [];
}