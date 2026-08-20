"use client";

import {
    useMemo,
    useState,
  } from "react";

import {
  Plus,
} from "lucide-react";

import {
  AppPage,
} from "@/components/common/app-page";

import {
  DataTable,
} from "@/components/common/data-table/data-table";

import {
  Button,
} from "@/components/ui/button";

import {
  useSchoolAdmins,
} from "@/features/school-admins/hooks";

import {
  getSchoolAdminColumns,
} from "@/features/school-admins/constants/columns";

import {
    CreateSchoolAdminDialog,
    EditSchoolAdminDialog,
    ViewSchoolAdminDialog,
    DeleteSchoolAdminDialog,
  } from "@/features/school-admins/components/dialogs";

import {
    useUpdateSchoolAdminStatus,
  } from "@/features/school-admins/controllers";


export default function SchoolAdminsPage() {
  
    const {
    data: admins = [],
    isLoading,
    isError,
    error,
  } = useSchoolAdmins();
  
  const [
    selectedAdminId,
    setSelectedAdminId,
  ] = useState<string | null>(
    null,
  );
  
  const [
    openViewDialog,
    setOpenViewDialog,
  ] = useState(false);

  const [
    openCreateDialog,
    setOpenCreateDialog,
  ] = useState(false);
  
  const {
    updateStatus,
    } = useUpdateSchoolAdminStatus();
  
    const selectedAdmin = useMemo(
        () =>
        admins.find(
            (admin) =>
            admin.id ===
            selectedAdminId,
        ) ?? null,
        [
        admins,
        selectedAdminId,
        ],
    );
  
  const [
    openEditDialog,
    setOpenEditDialog,
  ] = useState(false);

  const [
    openDeleteDialog,
    setOpenDeleteDialog,
  ] = useState(false);
  
  const columns = useMemo(
    () =>
      getSchoolAdminColumns({
        onView: (admin) => {
            setSelectedAdminId(
              admin.id,
            );
          
            setOpenViewDialog(true);
          },

        onEdit: (admin) => {
            setSelectedAdminId(
              admin.id,
            );
          
            setOpenEditDialog(
              true,
            );
          },

        onStatusChange: (
            admin,
          ) => {
            void updateStatus(
              admin,
            );
          },

        onDelete: (admin) => {
            setSelectedAdminId(
              admin.id,
            );
          
            setOpenDeleteDialog(
              true,
            );
          },
      }),
    [],
  );

  if (isLoading) {
    return (
      <AppPage>
        <div className="flex h-64 items-center justify-center">
          Loading...
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
            : "Unable to load school admins."}
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <DataTable
        columns={columns}
        data={admins}
        toolbarActions={
            <Button
            onClick={() =>
              setOpenCreateDialog(
                true,
              )
            }
          >
            <Plus className="mr-2 size-4" />
            Add School Admin
          </Button>
        }
      />

    <CreateSchoolAdminDialog
        open={openCreateDialog}
        onOpenChange={
            setOpenCreateDialog
        }
    />

    <EditSchoolAdminDialog
        open={openEditDialog}
        onOpenChange={(open) => {
            setOpenEditDialog(
            open,
            );

            if (!open) {
            setSelectedAdminId(
                null,
            );
            }
        }}
        admin={selectedAdmin}
    />

    <ViewSchoolAdminDialog
        open={openViewDialog}
        onOpenChange={(open) => {
            setOpenViewDialog(open);

            if (!open) {
            setSelectedAdminId(null);
            }
        }}
        userId={selectedAdminId}
    />

    <DeleteSchoolAdminDialog
    open={openDeleteDialog}
    onOpenChange={(open) => {
        setOpenDeleteDialog(
        open,
        );

        if (!open) {
        setSelectedAdminId(
            null,
        );
        }
    }}
    admin={selectedAdmin}
    />
    </AppPage>
  );
}