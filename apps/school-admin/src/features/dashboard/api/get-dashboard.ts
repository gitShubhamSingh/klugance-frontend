import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { ApiResponse } from "@/core/api/types/api-response";
import type { SchoolDashboard } from "../types";

export async function getDashboard(): Promise<SchoolDashboard> {
  const { data } = await apiClient.get<
    ApiResponse<SchoolDashboard>
  >(API_ENDPOINTS.DASHBOARD.OVERVIEW);

  if (!data.data) {
    throw new Error("Dashboard data is unavailable.");
  }

  return data.data;
}