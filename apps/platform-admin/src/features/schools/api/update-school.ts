import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import {
  School,
  UpdateSchoolRequest,
} from "../types";

export async function updateSchool(
  id: string,
  payload: UpdateSchoolRequest,
): Promise<School> {
  const { data } = await apiClient.put(
    API_ENDPOINTS.SCHOOLS.UPDATE(id),
    payload,
  );

  return data.data;
}