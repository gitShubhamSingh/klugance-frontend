import axios from "axios";

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { GuardianFormData } from "../schemas/guardian.schema";
import type {
  LinkStudentGuardianPayload,
  StudentGuardian,
} from "../types/guardian";

/*
 * Turns FastAPI errors ({ detail: string } or the
 * 422 { detail: [{ msg }] } list) into an Error the
 * dialog can show as-is.
 */
function toError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; detail?: unknown }
      | undefined;

    const detail = data?.detail;

    if (typeof detail === "string") {
      return new Error(detail);
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const message = detail
        .map((item) =>
          typeof item?.msg === "string"
            ? item.msg.replace(/^Value error, /, "")
            : null,
        )
        .filter(Boolean)
        .join(" ");

      if (message) {
        return new Error(message);
      }
    }

    if (typeof data?.message === "string") {
      return new Error(data.message);
    }

    return new Error(error.message);
  }

  return error instanceof Error
    ? error
    : new Error("Something went wrong.");
}

export function toLinkGuardianPayload(
  values: GuardianFormData,
): LinkStudentGuardianPayload {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),

    email: values.email.trim().toLowerCase(),
    mobile_number: values.mobile_number.trim(),

    occupation: values.occupation?.trim() || null,

    relationship_type: values.relationship_type,
    is_primary_contact: values.is_primary_contact,
  };
}

export async function getStudentGuardians(
  studentId: string,
): Promise<StudentGuardian[]> {
  try {
    const { data } = await apiClient.get<
      ApiResponse<StudentGuardian[]>
    >(API_ENDPOINTS.STUDENTS.PARENTS(studentId));

    return data.data;
  } catch (error) {
    throw toError(error);
  }
}

/*
 * Registers the parent (default portal password =
 * their email) or reuses the existing parent with
 * the same email, then links them to the student.
 */
export async function createStudentGuardian(
  studentId: string,
  payload: LinkStudentGuardianPayload,
): Promise<StudentGuardian> {
  try {
    const { data } = await apiClient.post<
      ApiResponse<StudentGuardian>
    >(API_ENDPOINTS.STUDENTS.PARENTS(studentId), payload);

    return data.data;
  } catch (error) {
    throw toError(error);
  }
}

/*
 * Unlinks the parent from this student only; the
 * parent account and sibling links are kept.
 */
export async function deleteStudentGuardian(
  studentId: string,
  guardianId: string,
): Promise<void> {
  try {
    await apiClient.delete(
      API_ENDPOINTS.STUDENTS.PARENT_LINK(
        studentId,
        guardianId,
      ),
    );
  } catch (error) {
    throw toError(error);
  }
}
