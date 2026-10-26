import axios from "axios";

type ApiErrorBody = {
  detail?: unknown;
  message?: unknown;
};

/** Turns an API error into a short message a user can act on. */
export function getAccountErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;

    if (typeof body?.detail === "string") return body.detail;
    if (typeof body?.message === "string") return body.message;

    if (error.response?.status === 401) return "Your current password is incorrect, or your session has expired.";
    if (error.response?.status === 429) return "Too many attempts. Please wait a moment and try again.";
    if (!error.response) return "Unable to reach the server. Check your connection and try again.";
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
