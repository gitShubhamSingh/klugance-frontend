"use client";

import {
  CircleCheck,
  CircleOff,
} from "lucide-react";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useUpdateProductStatus,
} from "../../controllers";

import {
  Product,
  ProductStatus,
} from "../../types";

interface ProductStatusDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  product: Product | null;
}

export function ProductStatusDialog({
  open,
  onOpenChange,
  product,
}: ProductStatusDialogProps) {
  const controller =
    useUpdateProductStatus();

  if (!product) {
    return null;
  }

  const nextStatus: ProductStatus =
    product.status === "ACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  const activating =
    nextStatus === "ACTIVE";

  async function handleConfirm() {
    await controller.updateStatus(
      product!.id,
      nextStatus,
    );

    onOpenChange(false);
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={(value) => {
        if (!controller.loading) {
          onOpenChange(value);
        }
      }}
      title={
        activating
          ? "Activate Product"
          : "Deactivate Product"
      }
      description={
        activating
          ? "Confirm that this product should become active."
          : "Confirm that this product should become inactive."
      }
      size="sm"
      loading={controller.loading}
      footer={
        <DialogFooter
          cancelLabel="Cancel"
          submitLabel={
            activating
              ? "Activate Product"
              : "Deactivate Product"
          }
          loading={controller.loading}
          onCancel={() => {
            if (!controller.loading) {
              onOpenChange(false);
            }
          }}
          onSubmit={handleConfirm}
        />
      }
    >
      <div className="flex gap-4 py-2">
        <div
          className={
            activating
              ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10"
              : "flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10"
          }
        >
          {activating ? (
            <CircleCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <CircleOff className="size-5 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium">
            {activating
              ? "Activate"
              : "Deactivate"}{" "}
            &quot;{product.name}&quot;?
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {activating
              ? "The product will become available as an active platform product."
              : "The product will be marked inactive. Existing product data will not be deleted."}
          </p>
        </div>
      </div>
    </BaseDialog>
  );
}