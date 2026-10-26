import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { ParentChild } from "../types/parent-child";

/** Students linked to the signed-in parent (resolved from the session). */
export async function getParentChildren(): Promise<ParentChild[]> {
  const { data } = await apiClient.get<ApiResponse<ParentChild[]>>(
    API_ENDPOINTS.PARENT.CHILDREN,
  );

  return data.data;
}
