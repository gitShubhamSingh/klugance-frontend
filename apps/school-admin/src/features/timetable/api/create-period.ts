import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  CreatePeriodPayload,
  Period,
} from "../types/period";

export async function createPeriod(
  payload: CreatePeriodPayload,
): Promise<Period> {
  const { data } = await apiClient.post<ApiResponse<Period>>(
    API_ENDPOINTS.PERIODS.CREATE,
    payload,
  );

  return data.data;
}