"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useDeleteProduct,
} from "../../controllers";

interface DeleteProductDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  productId: string | null;
  productName?: string;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  productId,
  productName,
}: DeleteProductDialogProps) {
  if (!productId) {
    return null;
  }

  return (
    <DeleteProductDialogContent
      open={open}
      onOpenChange={onOpenChange}
      productId={productId}
      productName={productName}
    />
  );
}

interface DeleteProductDialogContentProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  productId: string;
  productName?: string;
}

function DeleteProductDialogContent({
  open,
  onOpenChange,
  productId,
  productName,
}: DeleteProductDialogContentProps) {
  const controller =
    useDeleteProduct({
      productId,

      onSuccess: () => {
        onOpenChange(false);
      },
    });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(value) => {
        if (!controller.loading) {
          onOpenChange(value);
        }
      }}
      title="Delete Product"
      description="This action cannot be undone."
      size="sm"
      loading={controller.loading}
      footer={
        <DialogFooter
          cancelLabel="Cancel"
          submitLabel="Delete Product"
          loading={controller.loading}
          onCancel={() => {
            if (!controller.loading) {
              onOpenChange(false);
            }
          }}
          onSubmit={
            controller.onDelete
          }
        />
      }
    >
      <div className="flex gap-4 py-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Delete{" "}
            {productName
              ? `"${productName}"`
              : "this product"}
            ?
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The product will be removed from
            the platform. This operation
            cannot be reversed.
          </p>
        </div>
      </div>
    </BaseDialog>
  );
}