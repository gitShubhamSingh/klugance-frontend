"use client";

import {
  AlertCircle,
} from "lucide-react";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useProduct,
} from "../../hooks";

import {
  UpdateProductFormProvider,
} from "../providers";

import {
  UpdateProductForm,
} from "../forms";

import {
  useUpdateProduct,
} from "../../controllers";

interface EditProductDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  productId: string | null;
}

export function EditProductDialog({
  open,
  onOpenChange,
  productId,
}: EditProductDialogProps) {
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

  if (!open) {
    return null;
  }

  if (isLoading) {
    return (
      <BaseDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Product"
        description="Loading product information."
        size="md"
      >
        <div className="space-y-5 py-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-16 animate-pulse rounded-lg bg-muted" />
            <div className="h-16 animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </BaseDialog>
    );
  }

  if (
    isError ||
    !product ||
    !productId
  ) {
    return (
      <BaseDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Product"
        description="Unable to load product information."
        size="md"
      >
        <div className="flex min-h-40 items-center justify-center">
          <div className="max-w-sm text-center">
            <AlertCircle className="mx-auto size-6 text-destructive" />

            <p className="mt-3 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Unable to load product."}
            </p>
          </div>
        </div>
      </BaseDialog>
    );
  }

  return (
    <UpdateProductFormProvider
      key={product.id}
      defaultValues={{
        name: product.name,
        description:
          product.description ?? "",
      }}
    >
      {(form) => (
        <EditProductDialogContent
          productId={product.id}
          productCode={product.code}
          form={form}
          open={open}
          onOpenChange={
            onOpenChange
          }
        />
      )}
    </UpdateProductFormProvider>
  );
}


import {
    UseFormReturn,
  } from "react-hook-form";
  
  import {
    UpdateProductFormValues,
  } from "../../schemas";
  
  interface EditProductDialogContentProps {
    open: boolean;
  
    onOpenChange: (
      open: boolean,
    ) => void;
  
    productId: string;
    productCode: string;
  
    form: UseFormReturn<UpdateProductFormValues>;
  }
  
  function EditProductDialogContent({
    open,
    onOpenChange,
    productId,
    productCode,
    form,
  }: EditProductDialogContentProps) {
    const controller =
      useUpdateProduct({
        productId,
        form,
  
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
        title="Edit Product"
        description="Update product information."
        size="md"
        loading={controller.loading}
        footer={
          <DialogFooter
            cancelLabel="Cancel"
            submitLabel="Save Changes"
            loading={
              controller.loading
            }
            onCancel={() => {
              if (!controller.loading) {
                onOpenChange(false);
              }
            }}
            onSubmit={
              controller.onSubmit
            }
          />
        }
      >
        <UpdateProductForm
          form={form}
          productCode={
            productCode
          }
        />
      </BaseDialog>
    );
  }