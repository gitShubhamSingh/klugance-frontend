"use client";

import { useQuery } from "@tanstack/react-query";

import { getParentChildren } from "../api/get-parent-children";
import { useSelectedChildStore } from "../store/selected-child.store";

export const parentChildKeys = {
  all: ["parent-children"] as const,
};

export function useParentChildren() {
  return useQuery({
    queryKey: parentChildKeys.all,
    queryFn: getParentChildren,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * The linked children plus the one currently selected (the first child
 * until the parent picks another; the choice is kept across pages).
 */
export function useSelectedChild() {
  const childrenQuery = useParentChildren();
  const childId = useSelectedChildStore((state) => state.childId);
  const setChildId = useSelectedChildStore((state) => state.setChildId);

  const children = childrenQuery.data ?? [];
  const child =
    children.find((c) => c.student_profile_id === childId) ?? children[0] ?? null;

  return { childrenQuery, children, child, setChildId };
}
