import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    SchoolAdmin,
    SchoolAdminStatus,
  } from "../types";
  
  export async function updateSchoolAdminStatus(
    userId: string,
    status: SchoolAdminStatus,
  ): Promise<SchoolAdmin> {
    const { data } =
      await apiClient.patch(
        API_ENDPOINTS.SCHOOLADMINS.STATUS(
          userId,
        ),
        {
          status,
        },
      );
  
    return data.data;
  }