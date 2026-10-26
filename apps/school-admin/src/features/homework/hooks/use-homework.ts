"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getHomeworkActivity, getSchoolHomework, getSchoolHomeworkDetail } from "../api/homework";

const keys = {
  all: ["school-homework"] as const,
  list: (date: string) => [...keys.all, "list", date] as const,
  detail: (id: string, date: string) => [...keys.all, "detail", id, date] as const,
  activity: () => [...keys.all, "activity"] as const,
};

// Teachers, students and parents work through the day: refresh while open.
const REFRESH_MS = 60_000;

export function useSchoolHomework(date: string) {
  return useQuery({
    queryKey: keys.list(date),
    queryFn: () => getSchoolHomework(date),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  });
}

export function useSchoolHomeworkDetail(id: string | null, date: string) {
  return useQuery({
    queryKey: keys.detail(id ?? "", date),
    queryFn: () => getSchoolHomeworkDetail(id!, date),
    enabled: Boolean(id),
    refetchInterval: REFRESH_MS,
  });
}

export function useHomeworkActivity() {
  return useQuery({ queryKey: keys.activity(), queryFn: () => getHomeworkActivity(40), refetchInterval: REFRESH_MS });
}
