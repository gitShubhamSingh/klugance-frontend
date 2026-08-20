import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    SchoolAdmin,
    UpdateSchoolAdminRequest,
  } from "../types";
  
  export async function updateSchoolAdmin(
    userId: string,
    payload: UpdateSchoolAdminRequest,
  ): Promise<SchoolAdmin> {
    const { data } =
      await apiClient.put(
        API_ENDPOINTS.SCHOOLADMINS.UPDATE(
          userId,
        ),
        payload,
      );
  
    return data.data;
  }