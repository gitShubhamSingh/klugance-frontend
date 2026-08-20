"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Power,
} from "lucide-react";

import { School } from "../types/school";

import {
  DataTableColumnHeader,
} from "@/components/common/data-table/data-table-column-header";

import {
  SchoolCell,
  PhoneCell,
  WebsiteCell,
  StatusCell,
} from "../components/cells";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export interface SchoolColumnActions {
  onView: (school: School) => void;
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
  onStatusChange: (school: School) => void;
}

export function getSchoolColumns({
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: SchoolColumnActions): ColumnDef<School>[] {
  return [
    {
      accessorKey: "name",

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="School"
        />
      ),

      cell: ({ row }) => (
        <SchoolCell
          school={row.original}
        />
      ),
    },

    {
      accessorKey: "mobile_number",

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone"
        />
      ),

      cell: ({ row }) => (
        <PhoneCell
          phone={row.original.mobile_number}
        />
      ),
    },

    {
      accessorKey: "website",

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Website"
        />
      ),

      cell: ({ row }) => (
        <WebsiteCell
          website={row.original.website}
        />
      ),
    },

    {
      accessorKey: "status",

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),

      cell: ({ row }) => (
        <StatusCell
          active={
            row.original.status === "ACTIVE"
          }
        />
      ),
    },

    {
      id: "actions",

      enableHiding: false,

      cell: ({ row }) => {
        const school = row.original;

        const isActive =
          school.status === "ACTIVE";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                />
              }
            >
              <MoreHorizontal className="size-4" />

              <span className="sr-only">
                Open actions
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44"
            >
              {/* View */}
              <DropdownMenuItem
                onClick={() =>
                  onView(school)
                }
              >
                <Eye className="size-4" />

                View
              </DropdownMenuItem>

              {/* Edit */}
              <DropdownMenuItem
                onClick={() =>
                  onEdit(school)
                }
              >
                <Pencil className="size-4" />

                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Activate / Deactivate */}
              <DropdownMenuItem
                onClick={() =>
                  onStatusChange(school)
                }
              >
                <Power className="size-4" />

                {isActive
                  ? "Deactivate"
                  : "Activate"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Delete */}
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  onDelete(school)
                }
              >
                <Trash2 className="size-4" />

                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}