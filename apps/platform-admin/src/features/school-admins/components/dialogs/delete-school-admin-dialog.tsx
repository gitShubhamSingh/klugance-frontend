"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  useDeleteSchoolAdmin,
} from "../../controllers";

import type {
  SchoolAdmin,
} from "../../types";

interface DeleteSchoolAdminDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  admin: SchoolAdmin | null;
}

export function DeleteSchoolAdminDialog({
  open,
  onOpenChange,
  admin,
}: DeleteSchoolAdminDialogProps) {
  const {
    deleteSchoolAdmin,
    isDeleting,
    error,
    reset,
  } = useDeleteSchoolAdmin();

  const handleOpenChange = (
    value: boolean,
  ) => {
    if (isDeleting) {
      return;
    }

    if (!value) {
      reset();
    }

    onOpenChange(value);
  };

  const handleDelete =
    async () => {
      if (!admin) {
        return;
      }

      try {
        await deleteSchoolAdmin(
          admin.id,
        );

        onOpenChange(false);
      } catch {
        // Error rendered below.
      }
    };

  return (
    <BaseDialog
      open={open}
      onOpenChange={
        handleOpenChange
      }
      title="Delete School Admin"
      description="This action will remove this administrator from active school administration."
      size="sm"
      loading={isDeleting}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() =>
              handleOpenChange(
                false,
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={
              isDeleting ||
              !admin
            }
            onClick={() => {
              void handleDelete();
            }}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Admin"}
          </Button>
        </div>
      }
    >
      {admin && (
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-medium">
                Are you sure?
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                You are about to delete{" "}
                <span className="font-medium text-foreground">
                  {admin.first_name}{" "}
                  {admin.last_name}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium">
              {admin.first_name}{" "}
              {admin.middle_name
                ? `${admin.middle_name} `
                : ""}
              {admin.last_name}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {admin.email}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {admin.school.name}
              {" · "}
              {admin.school.code}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                {getErrorMessage(
                  error,
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </BaseDialog>
  );
}

function getErrorMessage(
  error: unknown,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to delete school admin.";
}