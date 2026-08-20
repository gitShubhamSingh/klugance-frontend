"use client";

import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Teacher,
  TeacherStatus,
} from "../types";

import {
  useTeachers,
} from "../hooks/use-teachers";

import {
  CreateTeacherDialog,
} from "./create-teacher-dialog";

import {
  TeachersTable,
} from "./teachers-table";

type StatusFilter =
  | "all"
  | TeacherStatus;

export function TeachersPage() {
  const {
    data: teachers = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useTeachers();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();
  
    if (!query) {
      return teachers;
    }
  
    return teachers.filter((teacher) => {
      const employeeCode =
        teacher.employee_code?.toLowerCase() ?? "";
  
      const qualification =
        teacher.qualification?.toLowerCase() ?? "";
  
      const bio =
        teacher.bio?.toLowerCase() ?? "";
  
      return (
        employeeCode.includes(query) ||
        qualification.includes(query) ||
        bio.includes(query)
      );
    });
  }, [teachers, searchQuery]);

  function handleView(
    teacher: Teacher,
  ) {
    /*
     * Profile drawer/page will be added
     * in the teacher profile step.
     */
    console.log(
      "View teacher:",
      teacher.id,
    );
  }

  function handleEdit(
    teacher: Teacher,
  ) {
    /*
     * Edit dialog will be connected
     * after the create flow is complete.
     */
    console.log(
      "Edit teacher:",
      teacher.id,
    );
  }

  function handleDeactivate(
    teacher: Teacher,
  ) {
    /*
     * Activate/deactivate mutation will
     * be connected with the backend API.
     */
    console.log(
      "Toggle teacher status:",
      teacher.id,
      teacher.status,
    );
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Teachers
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage teachers, staff
            accounts, and teaching
            assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh teachers"
            disabled={isFetching}
            onClick={() =>
              void refetch()
            }
          >
            <RefreshCw
              className={
                isFetching
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />
          </Button>

          <CreateTeacherDialog />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading teachers...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
          <AlertCircle className="size-8 text-destructive" />

          <h2 className="mt-4 text-lg font-semibold">
            Unable to load teachers
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Teacher data could not be
            loaded. Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() =>
              void refetch()
            }
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loaded state */}
      {!isLoading && !isError && (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teachers..."
                />
              </div>

              {/* Status */}
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(
                    value as StatusFilter,
                  );
                }}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All Teachers
                  </SelectItem>

                  <SelectItem value="active">
                    Active
                  </SelectItem>

                  <SelectItem value="inactive">
                    Inactive
                  </SelectItem>

                  <SelectItem value="on_leave">
                    On Leave
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {
                  filteredTeachers.length
                }
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {teachers.length}
              </span>{" "}
              teachers
            </div>
          </div>

          {/* Empty database */}
          {teachers.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="size-6 text-primary" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No teachers yet
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Add your first teacher to
                start managing your
                school's teaching staff.
              </p>

              <div className="mt-5">
                <CreateTeacherDialog />
              </div>
            </div>
          ) : filteredTeachers.length ===
            0 ? (
            /* No filter results */
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
              <Search className="size-7 text-muted-foreground" />

              <h2 className="mt-4 font-semibold">
                No teachers found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                No teachers match your
                current search or status
                filter.
              </p>

              <Button
                type="button"
                variant="ghost"
                className="mt-3"
                onClick={
                  clearFilters
                }
              >
                Clear filters
              </Button>
            </div>
          ) : (
            /* Teachers table */
            <TeachersTable
              teachers={
                filteredTeachers
              }
              onView={handleView}
              onEdit={handleEdit}
              onDeactivate={
                handleDeactivate
              }
            />
          )}
        </>
      )}
    </div>
  );
}