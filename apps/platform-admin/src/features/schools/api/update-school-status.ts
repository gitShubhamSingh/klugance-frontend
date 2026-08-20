import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import {
  School,
  UpdateSchoolStatusRequest,
} from "../types";

export async function updateSchoolStatus(
  id: string,
  payload: UpdateSchoolStatusRequest,
): Promise<School> {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.SCHOOLS.STATUS(id),
    payload,
  );

  return data.data;
}