import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { SchoolClass } from "../types";

export async function getClasses(
): Promise<SchoolClass[]> {

  const { data } =
    await apiClient.get<
      ApiResponse<SchoolClass[]>
    >(
      API_ENDPOINTS.CLASSES.LIST
    );

  return data.data ?? [];
}