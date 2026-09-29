import axios from "axios";

import { apiClient } from "@/core/api/client";

import {
  API_ENDPOINTS,
} from "@/core/api/endpoints";

import type {
  CreateSubjectPayload,
  Subject,
  UpdateSubjectPayload,
} from "../types";

export async function getSubjects(): Promise<Subject[]> {
  const response = await apiClient.get(
    API_ENDPOINTS.SUBJECTS.LIST,
  );

  return response.data.data ?? [];
}

export async function getSubject(
  subjectId: string,
): Promise<Subject> {
  const response = await apiClient.get(
    API_ENDPOINTS.SUBJECTS.DETAIL(subjectId),
  );

  return response.data.data;
}


export async function createSubject(
  payload: CreateSubjectPayload,
): Promise<Subject> {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBJECTS.CREATE,
      payload,
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "CREATE SUBJECT ERROR:",
        error.response?.status,
        error.response?.data,
      );
    }

    throw error;
  }
}

// export async function createSubject(
//   payload: CreateSubjectPayload,
// ): Promise<Subject> {
//   try {
//     const response = await apiClient.post(
//       API_ENDPOINTS.SUBJECTS.CREATE,
//       payload,
//     );

//     if (!response.data.data) {
//       throw new Error(
//         "Created subject data is unavailable.",
//       );
//     }

//     return response.data.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(
//         "Create subject failed:",
//         error.response?.data,
//       );

//       const backendMessage =
//         error.response?.data?.message;

//       if (backendMessage) {
//         throw new Error(backendMessage);
//       }
//     }

//     throw error;
//   }
// }

export async function updateSubject(
  subjectId: string,
  payload: UpdateSubjectPayload,
): Promise<Subject> {
  const response = await apiClient.put(
    API_ENDPOINTS.SUBJECTS.UPDATE(subjectId),
    payload,
  );

  return response.data.data;
}

export async function deleteSubject(
  subjectId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.SUBJECTS.DELETE(subjectId),
  );
}