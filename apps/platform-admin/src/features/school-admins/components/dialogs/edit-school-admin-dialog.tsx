"use client";

import {
  useEffect,
} from "react";

import {
  FormProvider,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  useUpdateSchoolAdmin,
} from "../../controllers";

import {
  updateSchoolAdminSchema,
} from "../../schemas";

import type {
  UpdateSchoolAdminFormValues,
} from "../../schemas";

import type {
  SchoolAdmin,
} from "../../types";

import {
  EditSchoolAdminForm,
} from "../forms";

interface EditSchoolAdminDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  admin: SchoolAdmin | null;
}

export function EditSchoolAdminDialog({
  open,
  onOpenChange,
  admin,
}: EditSchoolAdminDialogProps) {
  const form =
    useForm<UpdateSchoolAdminFormValues>({
      resolver: zodResolver(
        updateSchoolAdminSchema,
      ),

      defaultValues: {
        first_name: "",
        middle_name: null,
        last_name: "",
        mobile_number: "",
        profile_picture: null,
        status: "ACTIVE",
      },
    });

  const {
    updateSchoolAdmin,
    isUpdating,
    error,
    reset: resetMutation,
  } = useUpdateSchoolAdmin();

  useEffect(() => {
    if (
      !open ||
      !admin
    ) {
      return;
    }

    form.reset({
      first_name:
        admin.first_name,

      middle_name:
        admin.middle_name,

      last_name:
        admin.last_name,

      mobile_number:
        admin.mobile_number,

      profile_picture:
        admin.profile_picture,

      status:
        admin.status,
    });

    resetMutation();
  }, [
    open,
    admin,
    form,
    resetMutation,
  ]);

  const handleOpenChange = (
    value: boolean,
  ) => {
    if (
      isUpdating
    ) {
      return;
    }

    if (!value) {
      resetMutation();
    }

    onOpenChange(
      value,
    );
  };

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        if (!admin) {
          return;
        }

        try {
          await updateSchoolAdmin({
            userId:
              admin.id,

            payload: {
              first_name:
                values.first_name,

              middle_name:
                values.middle_name ||
                null,

              last_name:
                values.last_name,

              mobile_number:
                values.mobile_number,

              profile_picture:
                values.profile_picture ||
                null,

              // Preserve current status.
              status:
                admin.status,
            },
          });

          onOpenChange(
            false,
          );
        } catch {
          // Mutation error rendered below.
        }
      },
    );

  return (
    <FormProvider {...form}>
      <BaseDialog
        open={open}
        onOpenChange={
          handleOpenChange
        }
        title="Edit School Admin"
        description={
          admin
            ? `Update profile information for ${admin.first_name} ${admin.last_name}.`
            : "Update school administrator information."
        }
        size="lg"
        loading={
          isUpdating
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={
                isUpdating
              }
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
              disabled={
                isUpdating ||
                !admin
              }
              onClick={() => {
                void onSubmit();
              }}
            >
              {isUpdating
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        }
      >
        {admin && (
          <>
            {/* Read-only identity context */}
            <div className="rounded-lg bg-muted/40 px-4 py-3">
              <div className="text-sm font-medium">
                {admin.email}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {admin.school.name}
                {" · "}
                {admin.school.code}
              </div>
            </div>

            <EditSchoolAdminForm />
          </>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">
              {getErrorMessage(
                error,
              )}
            </p>
          </div>
        )}
      </BaseDialog>
    </FormProvider>
  );
}

function getErrorMessage(
  error: unknown,
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Unable to update school admin.";
}