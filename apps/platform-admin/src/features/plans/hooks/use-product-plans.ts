"use client";

import {
  useMemo,
} from "react";

import {
  usePlans,
} from "./use-plans";

export function useProductPlans(
  productId?: string,
) {
  const query = usePlans();

  const plans = useMemo(() => {
    if (!productId) {
      return [];
    }

    return (query.data ?? []).filter(
      (plan) =>
        plan.product_id === productId,
    );
  }, [
    query.data,
    productId,
  ]);

  return {
    ...query,
    data: plans,
  };
}