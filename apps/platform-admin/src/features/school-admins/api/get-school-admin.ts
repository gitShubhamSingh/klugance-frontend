import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    SchoolAdmin,
  } from "../types";
  
  export async function getSchoolAdmin(
    userId: string,
  ): Promise<SchoolAdmin> {
    const { data } =
      await apiClient.get(
        API_ENDPOINTS.SCHOOLADMINS.DETAIL(
          userId,
        ),
      );
  
    return data.data;
  }