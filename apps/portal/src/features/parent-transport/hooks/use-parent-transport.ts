"use client";

import { useQuery } from "@tanstack/react-query";

import { getParentTransport } from "../api/get-parent-transport";

export const parentTransportKeys = {
  all: ["parent-transport"] as const,
  child: (studentId: string, date: string) => [...parentTransportKeys.all, studentId, date] as const,
};

export function useParentTransport(studentId: string | null, date: string) {
  return useQuery({
    queryKey: parentTransportKeys.child(studentId ?? "", date),
    queryFn: () => getParentTransport(studentId!, date),
    enabled: Boolean(studentId),
    // Boarding / drop scans arrive during the trip.
    refetchInterval: 60 * 1000,
  });
}
