"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

export function useSchoolAdmins() {
  return useQuery({
    queryKey: ["school-admins"],

    queryFn: () =>
      schoolAdminService.list(),
  });
}