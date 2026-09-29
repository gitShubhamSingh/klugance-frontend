"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StudentsHeader } from "./students-header";

import { StudentsTable } from "./students-table";
import { StudentProfileDialog } from "./student-profile-dialog";
import { EditStudentDialog } from "./edit-student-dialog";

import { useStudents } from "../hooks/use-students";


import type { Student } from "../types";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

export function StudentsPage() {
  const {
    data: students = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useStudents();

  // ================================================================
  // SEARCH / FILTER STATE
  // ================================================================

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  // ================================================================
  // PROFILE STATE
  // ================================================================

  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState<Student | null>(null);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    editStudent,
    setEditStudent,
  ] = useState<Student | null>(null);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  // ================================================================
  // FILTER STUDENTS
  // ================================================================

  const filteredStudents = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return students.filter(
      (student: Student) => {
        // ----------------------------------------------------------
        // Search
        // ----------------------------------------------------------

        if (query) {
          const firstName =
            student.first_name
              ?.toLowerCase() ?? "";

          const middleName =
            student.middle_name
              ?.toLowerCase() ?? "";

          const lastName =
            student.last_name
              ?.toLowerCase() ?? "";

          const admissionNumber =
            student.admission_number
              ?.toLowerCase() ?? "";

          const email =
            student.email
              ?.toLowerCase() ?? "";

          const mobileNumber =
            student.mobile_number
              ?.toLowerCase() ?? "";

          const className =
            student.class_name
              ?.toLowerCase() ?? "";

          const sectionName =
            student.section_name
              ?.toLowerCase() ?? "";

          const matchesSearch =
            firstName.includes(query) ||
            middleName.includes(query) ||
            lastName.includes(query) ||
            admissionNumber.includes(query) ||
            email.includes(query) ||
            mobileNumber.includes(query) ||
            className.includes(query) ||
            sectionName.includes(query);

          if (!matchesSearch) {
            return false;
          }
        }

        // ----------------------------------------------------------
        // Status
        // ----------------------------------------------------------

        if (statusFilter !== "all") {
          const shouldBeActive =
            statusFilter === "active";

          if (
            student.is_active !==
            shouldBeActive
          ) {
            return false;
          }
        }

        return true;
      },
    );
  }, [
    students,
    searchQuery,
    statusFilter,
  ]);

  // ================================================================
  // VIEW PROFILE
  // ================================================================

  function handleViewProfile(
    student: Student,
  ) {
    setSelectedStudent(student);
    setProfileOpen(true);
  }

  // ================================================================
  // PROFILE CLOSE
  // ================================================================

  function handleProfileOpenChange(
    open: boolean,
  ) {
    setProfileOpen(open);

    if (!open) {
      setSelectedStudent(null);
    }
  }


  function handleEditStudent(
    student: Student,
  ) {
    setEditStudent(student);
    setEditOpen(true);
  }

  function handleEditOpenChange(
    open: boolean,
  ) {
    setEditOpen(open);

    if (!open) {
      setEditStudent(null);
    }
  }

  // ================================================================
  // CLEAR FILTERS
  // ================================================================

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="space-y-6 p-6">

      {/* ==========================================================
          HEADER
          ========================================================== */}

      <StudentsHeader
        totalStudents={students.length}
        isFetching={isFetching}
        refetch={refetch}
      />

      {/* ==========================================================
          LOADING
          ========================================================== */}

      {isLoading && (
        <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading students...
            </p>
          </div>
        </div>
      )}

      {/* ==========================================================
          ERROR
          ========================================================== */}

      {!isLoading && isError && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">

          <AlertCircle className="size-8 text-destructive" />

          <h2 className="mt-4 text-lg font-semibold">
            Unable to load students
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Student data could not be loaded. Please try again."}
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

      {/* ==========================================================
          LOADED
          ========================================================== */}

      {!isLoading && !isError && (
        <>

          {/* ========================================================
              SEARCH / FILTER BAR
              ======================================================== */}

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
                  placeholder="Search students..."
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
                    All Students
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

            {/* Count */}

            <div className="text-sm text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">
                {filteredStudents.length}
              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">
                {students.length}
              </span>

              {" "}students

            </div>

          </div>

          {/* ========================================================
              NO STUDENTS
              ======================================================== */}

          {students.length === 0 ? (

            <StudentsTable
              students={students}
              isLoading={false}
              onViewProfile={
                handleViewProfile
              }
            />

          ) : filteredStudents.length === 0 ? (

            /* ======================================================
               NO FILTER RESULTS
               ====================================================== */

            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">

              <Search className="size-7 text-muted-foreground" />

              <h2 className="mt-4 font-semibold">
                No students found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                No students match your current
                search or status filter.
              </p>

              <Button
                type="button"
                variant="ghost"
                className="mt-3"
                onClick={clearFilters}
              >
                Clear filters
              </Button>

            </div>

          ) : (

            /* ======================================================
               STUDENTS TABLE
               ====================================================== */

            <StudentsTable
              students={filteredStudents}
              isLoading={false}
              onViewProfile={
                handleViewProfile
              }
            />

          )}

        </>
      )}

      {/* ==========================================================
          PROFILE DIALOG
          ========================================================== */}

      <StudentProfileDialog
        student={selectedStudent}
        open={profileOpen}
        onOpenChange={
          handleProfileOpenChange
        }
      />

      {/* EDIT */}

      <EditStudentDialog
        student={editStudent}
        open={editOpen}
        onOpenChange={
          handleEditOpenChange
        }
      />

    </div>
  );
}