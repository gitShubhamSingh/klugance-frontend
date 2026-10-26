/**
 * Profile photo — upload, replace and remove the signed-in user's picture.
 *
 * The server validates and re-encodes the image, stores it (local disk today,
 * object storage later) and returns its public URL. URLs come from the API's
 * MEDIA_BASE_URL setting, so nothing here changes when storage moves to S3/CDN.
 */

import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export const PHOTO_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024; // 5 MB — keep in sync with PROFILE_PICTURE_MAX_BYTES on the API

export function validatePhoto(file: File): string | null {
  if (!PHOTO_ACCEPT.includes(file.type as (typeof PHOTO_ACCEPT)[number])) {
    return "Please choose a JPG, PNG or WEBP image.";
  }
  if (file.size > PHOTO_MAX_BYTES) {
    return "The image must be 5 MB or smaller.";
  }
  return null;
}

type ProfilePictureResponse = {
  profile_picture: string | null;
};

export const profilePhotoService = {
  /** Uploads (or replaces) the picture and returns its public URL. */
  async upload(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);

    const { data } = await apiClient.put<ProfilePictureResponse>(API_ENDPOINTS.AUTH.PROFILE_PICTURE, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!data.profile_picture) throw new Error("The server did not return the new photo.");
    return data.profile_picture;
  },

  async remove(): Promise<void> {
    await apiClient.delete<ProfilePictureResponse>(API_ENDPOINTS.AUTH.PROFILE_PICTURE);
  },
};
