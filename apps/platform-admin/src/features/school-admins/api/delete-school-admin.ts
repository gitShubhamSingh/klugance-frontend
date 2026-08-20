import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  export async function deleteSchoolAdmin(
    userId: string,
  ): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.SCHOOLADMINS.DELETE(
        userId,
      ),
    );
  }