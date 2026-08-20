"use client";
import { useState } from "react";

import {
  AlertCircle,
  CalendarDays,
  FileText,
  Hash,
  Package,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DetailField,
  DetailSection,
} from "@/components/common/detail-view";

import {
    ProductPlans,
  } from "@/features/plans/components";

import {
    CreatePlanDialog,
} from "@/features/plans/components/dialogs";

import { useProduct } from "../../hooks";
import { ProductDetailHeader } from "../details";

interface ViewProductDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  productId: string | null;
}

export function ViewProductDialog({
  open,
  onOpenChange,
  productId,
}: ViewProductDialogProps) {
  
    const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(
    open && productId
      ? productId
      : undefined,
  );

  const [
    openCreatePlan,
    setOpenCreatePlan,
  ] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          flex
          max-h-[90vh]
          w-[calc(100vw-2rem)]
          flex-col
          gap-0
          overflow-hidden
          sm:max-w-4xl
        "
      >
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle>
            Product Details
          </DialogTitle>

          <DialogDescription>
            Product information and platform configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading && (
            <ProductDetailsLoading />
          )}

          {isError && (
            <ProductDetailsError
              message={
                error instanceof Error
                  ? error.message
                  : "Unable to load product."
              }
            />
          )}

          {!isLoading &&
            !isError &&
            product && (
              <>
                <div className={
                        openCreatePlan
                            ? "pointer-events-none blur-sm transition-[filter] duration-200"
                            : "transition-[filter] duration-200"
                        }>
                  <ProductDetailHeader
                    product={product}
                  />
                </div>

                <div className="space-y-8 p-3">
                  <DetailSection
                    title="Product Information"
                    description="Core identity and configuration of this product."
                  >
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailField
                        label="Product Name"
                        value={product.name}
                        icon={
                          <Package className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Product Code"
                        value={
                          <span className="font-mono text-xs">
                            {product.code}
                          </span>
                        }
                        icon={
                          <Hash className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Status"
                        value={
                          product.status ===
                          "ACTIVE"
                            ? "Active"
                            : "Inactive"
                        }
                      />

                      <DetailField
                        label="Created At"
                        value={formatDateTime(
                          product.created_at,
                        )}
                        icon={
                          <CalendarDays className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Updated At"
                        value={formatDateTime(
                          product.updated_at,
                        )}
                        icon={
                          <CalendarDays className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Product ID"
                        value={
                          <span className="break-all font-mono text-xs text-muted-foreground">
                            {product.id}
                          </span>
                        }
                        icon={
                          <Hash className="size-3.5" />
                        }
                      />
                    </div>
                  </DetailSection>

                  <DetailSection
                    title="Description"
                    description="Purpose and capabilities of this product."
                  >
                    <div className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>

                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {product.description || (
                          <span className="text-muted-foreground">
                            No description available
                          </span>
                        )}
                      </p>
                    </div>
                  </DetailSection>

                  {/* Plans placeholder */}
                  <ProductPlans
                    productId={product.id}
                    />


                </div>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatDateTime(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function ProductDetailsLoading() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-5">
        <div className="size-20 animate-pulse rounded-2xl bg-muted" />

        <div className="flex-1 space-y-3">
          <div className="h-6 w-72 max-w-full animate-pulse rounded bg-muted" />

          <div className="h-4 w-44 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />

            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailsError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex min-h-[350px] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </div>

        <h3 className="mt-4 text-sm font-semibold">
          Unable to load product
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}