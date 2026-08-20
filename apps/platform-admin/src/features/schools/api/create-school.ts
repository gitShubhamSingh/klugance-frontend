import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { CreateSchoolFormValues } from "../schemas/create-school.schema";

export async function createSchool(
  payload: CreateSchoolFormValues,
) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.SCHOOLS.CREATE,
    payload,
  );

  return data;
}