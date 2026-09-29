"use client";

import { useState } from "react";

import {
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { CreateStudentDialog } from "./create-student-dialog";

type Props = {
  totalStudents: number;
  isFetching: boolean;
  refetch: () => Promise<unknown>;
};

export function StudentsHeader({
  totalStudents,
  isFetching,
  refetch,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        {/* =====================================================
            LEFT
            ===================================================== */}

        <div>

          <div className="flex items-center gap-3">

            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">

              <Users className="size-5 text-primary" />

            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Students
            </h1>

          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your school's students.
          </p>

        </div>

        {/* =====================================================
            RIGHT
            ===================================================== */}

        <div className="flex items-center gap-2">

          {/* Refresh */}

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh students"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
          >
            <RefreshCw
              className={
                isFetching
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />
          </Button>

          {/* Add Student */}

          <Button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add Student
          </Button>

        </div>

      </div>

      <CreateStudentDialog
        open={open}
        onOpenChange={setOpen}
      />

    </>
  );
}