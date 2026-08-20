"use client";

import {
  useMemo,
  useState,
} from "react";

import { Plus } from "lucide-react";

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
  useSchools,
} from "@/features/schools/hooks/use-schools";

import {
  getSchoolColumns,
} from "@/features/schools/constants/columns";

import {
  ViewSchoolDialog,
  CreateSchoolDialog,
  EditSchoolDialog,
} from "@/features/schools/components/dialogs";

import {
  useUpdateSchoolStatus,
} from "@/features/schools/controllers";

export default function SchoolsPage() {
  const {
    data: schools = [],
    isLoading,
    isError,
    error,
  } = useSchools();

  const [
    selectedSchoolId,
    setSelectedSchoolId,
  ] = useState<string | null>(
    null,
  );

  const selectedSchool =
    useMemo(
      () =>
        schools.find(
          (school) =>
            school.id ===
            selectedSchoolId,
        ) ?? null,
      [
        schools,
        selectedSchoolId,
      ],
    );

  const [
    openViewDialog,
    setOpenViewDialog,
  ] = useState(false);

  const [
    openCreateDialog,
    setOpenCreateDialog,
  ] = useState(false);

  const [
    openEditDialog,
    setOpenEditDialog,
  ] = useState(false);

  const {
    updateStatus,
  } = useUpdateSchoolStatus();

  const columns = useMemo(
    () =>
      getSchoolColumns({
        onView: (school) => {
          setSelectedSchoolId(
            school.id,
          );

          setOpenViewDialog(
            true,
          );
        },

        onEdit: (school) => {
          setSelectedSchoolId(
            school.id,
          );

          setOpenEditDialog(
            true,
          );
        },

        onStatusChange: (
          school,
        ) => {
          void updateStatus(
            school,
          );
        },

        onDelete: (school) => {
          console.log(
            "Delete",
            school,
          );
        },
      }),
    [updateStatus],
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
          {(error as Error).message}
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <DataTable
        columns={columns}
        data={schools}
        toolbarActions={
          <Button
            onClick={() =>
              setOpenCreateDialog(
                true,
              )
            }
          >
            <Plus className="mr-2 h-4 w-4" />

            Add School
          </Button>
        }
      />

      <ViewSchoolDialog
        open={openViewDialog}
        onOpenChange={(open) => {
          setOpenViewDialog(
            open,
          );

          if (!open) {
            setSelectedSchoolId(
              null,
            );
          }
        }}
        schoolId={
          selectedSchoolId
        }
      />

      <CreateSchoolDialog
        open={openCreateDialog}
        onOpenChange={
          setOpenCreateDialog
        }
      />

      <EditSchoolDialog
        open={openEditDialog}
        onOpenChange={(open) => {
          setOpenEditDialog(
            open,
          );

          if (!open) {
            setSelectedSchoolId(
              null,
            );
          }
        }}
        school={
          selectedSchool
        }
      />
    </AppPage>
  );
}