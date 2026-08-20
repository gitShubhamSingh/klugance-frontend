"use client";

import {
  Boxes,
  CalendarDays,
  Hash,
} from "lucide-react";

import { Product } from "../../types";

interface ProductDetailHeaderProps {
  product: Product;
}

export function ProductDetailHeader({
  product,
}: ProductDetailHeaderProps) {
  const isActive =
    product.status === "ACTIVE";

  return (
    <div className="p-5 flex flex-col gap-5 sm:flex-row sm:items-center">
      {/* Product icon */}
      <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-foreground/10">
        <Boxes className="size-9 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h2>

          <span
            className={
              isActive
                ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Hash className="size-3.5" />
            {product.code}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Created{" "}
            {new Date(
              product.created_at,
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}