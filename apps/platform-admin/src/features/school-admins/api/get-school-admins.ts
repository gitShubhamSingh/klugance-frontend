import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { SchoolAdmin } from "../types";

export async function getSchoolAdmins(): Promise<
  SchoolAdmin[]
> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.SCHOOLADMINS.LIST,
  );

  return data.data;
}