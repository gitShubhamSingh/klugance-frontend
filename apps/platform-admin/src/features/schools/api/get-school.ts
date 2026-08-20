import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { SchoolDetail } from "../types/school-detail";

interface GetSchoolResponse {
  success: boolean;
  status_code: number;
  message: string;

  data: SchoolDetail;

  errors: unknown[];
  meta: unknown;

  timestamp: string;
  trace_id: string | null;

  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function getSchool(
  id: string,
): Promise<SchoolDetail> {
  const { data } =
    await apiClient.get<GetSchoolResponse>(
      API_ENDPOINTS.SCHOOLS.DETAIL(id),
    );

  return data.data;
}