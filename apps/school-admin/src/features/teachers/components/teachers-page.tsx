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

import {
  TeacherProfileDialog,
} from "./teacher-profile-dialog";

import {
  EditTeacherDialog,
} from "./edit-teacher-dialog";

import { useUpdateTeacherStatus } from "../hooks/use-update-teacher-status";

import {
  AssignTeacherDialog,
} from "./assign-teacher-dialog";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";


export function TeachersPage() {
  /*
   * ---------------------------------------------------------
   * Teachers API
   * ---------------------------------------------------------
   */

  const {
    data: teachers = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useTeachers();

  const [
    selectedEditTeacher,
    setSelectedEditTeacher,
  ] = useState<Teacher | null>(null);
  
  const [
    isEditTeacherOpen,
    setIsEditTeacherOpen,
  ] = useState(false);

  const [
    selectedAssignTeacher,
    setSelectedAssignTeacher,
  ] = useState<Teacher | null>(null);
  
  const [
    isAssignTeacherOpen,
    setIsAssignTeacherOpen,
  ] = useState(false);

  const updateTeacherStatus =
  useUpdateTeacherStatus();

  /*
   * ---------------------------------------------------------
   * Page state
   * ---------------------------------------------------------
   */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");


  /*
   * ---------------------------------------------------------
   * Teacher profile dialog state
   * ---------------------------------------------------------
   */

  const [
    selectedTeacherId,
    setSelectedTeacherId,
  ] = useState<string | null>(null);


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  /*
   * ---------------------------------------------------------
   * Filtering
   * ---------------------------------------------------------
   *
   * Backend TeacherResponse currently contains:
   *
   * id
   * user_id
   * school_id
   * employee_code
   * joining_date
   * qualification
   * experience_years
   * bio
   * is_active
   *
   * Therefore we only search fields that actually exist.
   */

  const filteredTeachers = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();


    return teachers.filter(
      (teacher: Teacher) => {
        /*
         * Search filter
         */

        if (query) {
          const employeeCode =
            teacher.employee_code
              ?.toLowerCase() ?? "";

          const qualification =
            teacher.qualification
              ?.toLowerCase() ?? "";

          const bio =
            teacher.bio
              ?.toLowerCase() ?? "";

          const matchesSearch =
            employeeCode.includes(query) ||
            qualification.includes(query) ||
            bio.includes(query);

          if (!matchesSearch) {
            return false;
          }
        }


        /*
         * Status filter
         */

        if (
          statusFilter !== "all"
        ) {
          const isActive =
            statusFilter === "active";

          if (
            teacher.is_active !==
            isActive
          ) {
            return false;
          }
        }


        return true;
      },
    );
  }, [
    teachers,
    searchQuery,
    statusFilter,
  ]);


  /*
   * ---------------------------------------------------------
   * View Teacher
   * ---------------------------------------------------------
   */

  function handleView(
    teacher: Teacher,
  ) {
    setSelectedTeacherId(
      teacher.id,
    );

    setProfileOpen(true);
  }


  /*
   * ---------------------------------------------------------
   * Edit Teacher
   * ---------------------------------------------------------
   *
   * Edit flow will be implemented separately.
   */

  function handleEdit(
  teacher: Teacher,
) {
  setSelectedEditTeacher(teacher);
  setIsEditTeacherOpen(true);
}

function handleAssign(
  teacher: Teacher,
) {
  setSelectedAssignTeacher(teacher);
  setIsAssignTeacherOpen(true);
}

  /*
   * ---------------------------------------------------------
   * Activate / Deactivate Teacher
   * ---------------------------------------------------------
   *
   * Backend DELETE currently performs
   * soft-delete.
   *
   * We should NOT connect this blindly
   * to the button yet because the current
   * API contract does not expose a dedicated
   * activate endpoint.
   */

  async function handleDeactivate(
    teacher: Teacher,
  ) {
    try {
      await updateTeacherStatus.mutateAsync({
        teacherId: teacher.id,
        payload: {
          is_active: !teacher.is_active,
        },
      });
    } catch (error) {
      console.error(
        "Failed to update teacher status:",
        error,
      );
    }
  }


  /*
   * ---------------------------------------------------------
   * Clear filters
   * ---------------------------------------------------------
   */

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
  }


  /*
   * ---------------------------------------------------------
   * Profile dialog close
   * ---------------------------------------------------------
   */

  function handleProfileOpenChange(
    open: boolean,
  ) {
    setProfileOpen(open);

    /*
     * Clear selected teacher after
     * the dialog closes.
     *
     * Keeping the ID while the dialog is
     * closing is harmless, but clearing it
     * gives us a clean state.
     */

    if (!open) {
      setSelectedTeacherId(null);
    }
  }

  

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <div className="space-y-6 p-6">

      {/* =====================================================
          HEADER
          ===================================================== */}

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
            Manage teachers, staff accounts,
            and teaching assignments.
          </p>

        </div>


        <div className="flex items-center gap-2">

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh teachers"
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


          <CreateTeacherDialog />

        </div>

      </div>


      {/* =====================================================
          LOADING
          ===================================================== */}

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


      {/* =====================================================
          ERROR
          ===================================================== */}

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
            onClick={() => {
              void refetch();
            }}
          >
            Try Again
          </Button>

        </div>

      )}


      {/* =====================================================
          LOADED
          ===================================================== */}

      {!isLoading && !isError && (

        <>

          {/* =================================================
              FILTERS
              ================================================= */}

          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}

              <div className="relative w-full sm:w-80">

                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(
                      event.target.value,
                    );
                  }}
                  placeholder="Search teachers..."
                  className="pl-9"
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

                </SelectContent>

              </Select>

            </div>


            <div className="text-sm text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">
                {filteredTeachers.length}
              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">
                {teachers.length}
              </span>

              {" "}teachers

            </div>

          </div>


          {/* =================================================
              NO TEACHERS
              ================================================= */}

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
                start managing your school's
                teaching staff.
              </p>

              <div className="mt-5">
                <CreateTeacherDialog />
              </div>

            </div>

          ) : filteredTeachers.length === 0 ? (

            /* =================================================
               NO FILTER RESULTS
               ================================================= */

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

            /* =================================================
               TEACHERS TABLE
               ================================================= */

               <TeachersTable
                  teachers={filteredTeachers}
                  onView={handleView}
                  onEdit={handleEdit}
                  onAssign={handleAssign}
                  onDeactivate={
                    handleDeactivate
                  }
                />

          )}

        </>

      )}


      {/* =====================================================
          TEACHER PROFILE DIALOG
          ===================================================== */}

      <TeacherProfileDialog
        teacherId={selectedTeacherId}
        open={profileOpen}
        onOpenChange={(open) => {
          setProfileOpen(open);

          if (!open) {
            setSelectedTeacherId(null);
          }
        }}
      />

      <EditTeacherDialog
        teacher={selectedEditTeacher}
        open={isEditTeacherOpen}
        onOpenChange={(open) => {
          setIsEditTeacherOpen(open);

          if (!open) {
            setSelectedEditTeacher(null);
          }
        }}
      />

    <AssignTeacherDialog
      teacher={selectedAssignTeacher}
      open={isAssignTeacherOpen}
      onOpenChange={(open) => {
        setIsAssignTeacherOpen(open);

        if (!open) {
          setSelectedAssignTeacher(null);
        }
      }}
    />
    
    </div>
  );
}