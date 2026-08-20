import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    SchoolAdmin,
  } from "../types";
  
  import type {
    CreateSchoolAdminFormValues,
  } from "../schemas";
  
  export async function createSchoolAdmin(
    payload: CreateSchoolAdminFormValues,
  ): Promise<SchoolAdmin> {
    const { data } =
      await apiClient.post(
        API_ENDPOINTS.SCHOOLADMINS.CREATE,
        payload,
      );
  
    return data.data;
  }