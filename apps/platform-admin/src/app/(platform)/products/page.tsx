"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Boxes,
  Plus,
} from "lucide-react";

import { AppPage } from "@/components/common/app-page";
import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";

import {
  getProductColumns,
} from "@/features/products/constants/columns";

import {
  useProducts,
} from "@/features/products/hooks";

import {
  Product,
} from "@/features/products/types";

import {
    CreateProductDialog,
    ViewProductDialog,
    EditProductDialog,
    DeleteProductDialog,
    ProductStatusDialog,
  } from "@/features/products/components/dialogs";


export default function ProductsPage() {
  
    const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts();

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(null);

  const [
    openCreateDialog,
    setOpenCreateDialog,
  ] = useState(false);
  
  const [
    openViewDialog,
    setOpenViewDialog,
  ] = useState(false);

  const [
    openEditDialog,
    setOpenEditDialog,
  ] = useState(false);
  
  const [
    openDeleteDialog,
    setOpenDeleteDialog,
  ] = useState(false);

  const [
    openStatusDialog,
    setOpenStatusDialog,
  ] = useState(false);


  const columns = useMemo(
    () =>
      getProductColumns({
        onView: (product) => {
          setSelectedProduct(product);
          setOpenViewDialog(true);
        },
  
        onEdit: (product) => {
          setSelectedProduct(product);
          setOpenEditDialog(true);
        },
  
        onStatusChange: (product) => {
          setSelectedProduct(product);
          setOpenStatusDialog(true);
        },
  
        onDelete: (product) => {
          setSelectedProduct(product);
          setOpenDeleteDialog(true);
        },
      }),
    [],
  );

  if (isLoading) {
    return (
      <AppPage>
        <div className="flex h-64 items-center justify-center">
          Loading products...
        </div>
      </AppPage>
    );
  }

  if (isError) {
    return (
      <AppPage>
        <div className="flex h-64 items-center justify-center text-destructive">
          {error instanceof Error
            ? error.message
            : "Unable to load products."}
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="size-5" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Products
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage products available across the Klugance platform.
          </p>
        </div>

        <Button
            onClick={() =>
                setOpenCreateDialog(true)
            }
            >
            <Plus className="size-4" />
            Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
    />

    <ViewProductDialog
        open={openViewDialog}
        onOpenChange={(open) => {
            setOpenViewDialog(open);

            if (!open) {
            setSelectedProduct(null);
            }
        }}
        productId={
            selectedProduct?.id ?? null
        }
    />

    <CreateProductDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
    />

    <EditProductDialog
        open={openEditDialog}
        onOpenChange={(open) => {
            setOpenEditDialog(open);

            if (!open) {
            setSelectedProduct(null);
            }
        }}
        productId={
            selectedProduct?.id ?? null
        }
    />
    <DeleteProductDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
            setOpenDeleteDialog(open);

            if (!open) {
            setSelectedProduct(null);
            }
        }}
        productId={
            selectedProduct?.id ?? null
        }
        productName={
            selectedProduct?.name
        }
    />
    <ProductStatusDialog
        open={openStatusDialog}
        onOpenChange={(open) => {
            setOpenStatusDialog(open);

            if (!open) {
            setSelectedProduct(null);
            }
        }}
        product={selectedProduct}
    />
    
    </AppPage>
  );
}