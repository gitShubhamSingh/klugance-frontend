"use client";

import type {
  ColumnDef,
} from "@tanstack/react-table";

import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import {
  DataTableColumnHeader,
} from "@/components/common/data-table/data-table-column-header";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  SchoolAdmin,
} from "../types";

import {
  AdminCell,
  RolesCell,
  SchoolCell,
  StatusCell,
} from "../components/cells";

export interface SchoolAdminColumnActions {
  onView: (
    admin: SchoolAdmin,
  ) => void;

  onEdit: (
    admin: SchoolAdmin,
  ) => void;

  onStatusChange: (
    admin: SchoolAdmin,
  ) => void;

  onDelete: (
    admin: SchoolAdmin,
  ) => void;
}

export function getSchoolAdminColumns({
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: SchoolAdminColumnActions): ColumnDef<SchoolAdmin>[] {
  return [
    {
      id: "admin",

      accessorFn: (row) =>
        [
          row.first_name,
          row.middle_name,
          row.last_name,
        ]
          .filter(Boolean)
          .join(" "),

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Admin"
        />
      ),

      cell: ({ row }) => (
        <AdminCell
          admin={row.original}
        />
      ),
    },

    {
      id: "school",

      accessorFn: (row) =>
        row.school.name,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="School"
        />
      ),

      cell: ({ row }) => (
        <SchoolCell
          school={row.original.school}
        />
      ),
    },

    {
      id: "roles",

      accessorFn: (row) =>
        row.roles.map((role) => role.name).join(", "),

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Roles"
        />
      ),

      cell: ({ row }) => (
        <RolesCell
          roles={row.original.roles}
        />
      ),
    },

    {
        id: "status",
      
        accessorFn: (row) =>
          row.status,
      
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Status"
          />
        ),
      
        cell: ({ row }) => (
          <SchoolAdminStatusCell
            status={
              row.original.status
            }
          />
        ),
      },

    {
      id: "actions",

      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) => {
        const admin =
          row.original;
        
        const canToggleStatus =
          admin.status === "ACTIVE" ||
          admin.status === "INACTIVE";
        
        const isActive =
          admin.status === "ACTIVE";

        return (
          <div className="flex justify-end">
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
                <DropdownMenuItem
                  onClick={() =>
                    onView(admin)
                  }
                >
                  <Eye className="size-4" />
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    onEdit(admin)
                  }
                >
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>

                {canToggleStatus && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                        onClick={() =>
                            onStatusChange(
                            admin,
                            )
                        }
                        >
                        <Power className="size-4" />

                        {isActive
                            ? "Deactivate"
                            : "Activate"}
                        </DropdownMenuItem>
                    </>
                    )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    onDelete(admin)
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

function SchoolAdminStatusCell({
    status,
  }: {
    status: SchoolAdmin["status"];
  }) {
    if (status === "ACTIVE") {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
  
          Active
        </div>
      );
    }
  
    if (status === "INACTIVE") {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-muted-foreground" />
  
          Inactive
        </div>
      );
    }
  
    return (
      <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        {formatStatus(status)}
      </div>
    );
  }
  
  function formatStatus(
    status: SchoolAdmin["status"],
  ) {
    return status
      .toLowerCase()
      .split("_")
      .map(
        (part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1),
      )
      .join(" ");
  }