"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheck,
  CircleOff,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Product } from "../types";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GetProductColumnsProps {
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onStatusChange: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getProductColumns({
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: GetProductColumnsProps): ColumnDef<Product>[] {
  
  return [
    {
      accessorKey: "name",
      header: "Product",

      cell: ({ row }) => {
        const product = row.original;

        return (
          <div>
            <div className="font-medium">
              {product.name}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground">
              {product.code}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "description",
      header: "Description",

      cell: ({ row }) => (
        <div className="max-w-[380px] truncate text-muted-foreground">
          {row.original.description || "—"}
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
    
      cell: ({ row }) => {
        const status =
          row.original.status;
    
        const active =
          status === "ACTIVE";
    
        return (
          <div className="flex items-center gap-2">
            <span
              className={
                active
                  ? "size-2 rounded-full bg-emerald-500"
                  : "size-2 rounded-full bg-muted-foreground"
              }
            />
    
            <span
              className={
                active
                  ? "text-sm font-medium"
                  : "text-sm text-muted-foreground"
              }
            >
              {active
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: "Created",

      cell: ({ row }) => {
        const date = new Date(
          row.original.created_at,
        );

        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,

      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                  />
                }
              >
                <MoreHorizontal className="size-4" />

                <span className="sr-only">
                  Product actions
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    onView(product)
                  }
                >
                  <Eye className="size-4" />
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    onEdit(product)
                  }
                >
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(product)
                  }
                >
                  {product.status === "ACTIVE" ? (
                    <>
                      <CircleOff className="size-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CircleCheck className="size-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    onDelete(product)
                  }
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}