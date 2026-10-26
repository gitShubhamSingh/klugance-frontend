"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherProfile } from "../api/get-teacher-profile";

export const teacherProfileKeys = {
  all: ["teacher-profile"] as const,
};

export function useTeacherProfile() {
  return useQuery({
    queryKey: teacherProfileKeys.all,
    queryFn: getTeacherProfile,
  });
}
