"use client";

import {
  AlertCircle,
  Loader2,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useTeachers } from "@/features/teachers/hooks/use-teachers";
import type { Teacher } from "@/features/teachers/types";

import type { SchoolClass } from "../types";

type Props = {
  schoolClass: SchoolClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /**
   * Temporary frontend boundary.
   *
   * The actual teacher-class assignment API will be
   * connected here once the backend contract is ready.
   */
  onAssign?: (
    classId: string,
    teacherIds: string[],
  ) => void | Promise<void>;
};

function getTeacherName(teacher: Teacher) {
  return [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export function AssignTeacherDialog({
  schoolClass,
  open,
  onOpenChange,
  onAssign,
}: Props) {
  const teachersQuery = useTeachers();

  const teachers = teachersQuery.data ?? [];

  const [selectedTeacherIds, setSelectedTeacherIds] =
    useState<string[]>([]);

  const [search, setSearch] = useState("");

  const [isAssigning, setIsAssigning] =
    useState(false);

  const filteredTeachers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return teachers;
    }

    return teachers.filter((teacher) => {
      const name =
        getTeacherName(teacher).toLowerCase();

      const employeeCode =
        teacher.employee_code.toLowerCase();

      const email =
        teacher.email.toLowerCase();

      return (
        name.includes(normalizedSearch) ||
        employeeCode.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });
  }, [teachers, search]);

  const handleTeacherChange = (
    teacherId: string,
    checked: boolean,
  ) => {
    setSelectedTeacherIds((current) => {
      if (checked) {
        if (current.includes(teacherId)) {
          return current;
        }

        return [
          ...current,
          teacherId,
        ];
      }

      return current.filter(
        (id) => id !== teacherId,
      );
    });
  };

  const handleAssign = async () => {
    if (
      !schoolClass ||
      selectedTeacherIds.length === 0 ||
      isAssigning
    ) {
      return;
    }

    /**
     * Defensive deduplication.
     *
     * The checkbox UI already prevents duplicates,
     * but we keep the payload guaranteed to be unique.
     */
    const teacherIds = Array.from(
      new Set(selectedTeacherIds),
    );

    if (!onAssign) {
      return;
    }

    try {
      setIsAssigning(true);

      await onAssign(
        schoolClass.id,
        teacherIds,
      );

      setSelectedTeacherIds([]);
      setSearch("");
      onOpenChange(false);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isAssigning) {
      return;
    }

    if (!nextOpen) {
      setSelectedTeacherIds([]);
      setSearch("");
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Assign Teachers
          </DialogTitle>

          <DialogDescription>
            Select the teachers who should be assigned
            to{" "}
            <span className="font-medium text-foreground">
              {schoolClass?.name ?? "this class"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search teachers..."
            className="pl-9"
            disabled={
              teachersQuery.isLoading ||
              teachersQuery.isError ||
              isAssigning
            }
          />
        </div>

        {/* Teacher list */}
        <div className="max-h-[380px] overflow-y-auto rounded-xl border">
          {teachersQuery.isLoading && (
            <div className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading teachers...
              </div>
            </div>
          )}

          {teachersQuery.isError && (
            <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertCircle className="size-5 text-destructive" />
              </div>

              <p className="mt-3 text-sm font-medium">
                Unable to load teachers
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please try again.
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  void teachersQuery.refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {!teachersQuery.isLoading &&
            !teachersQuery.isError &&
            filteredTeachers.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <Users className="size-5 text-muted-foreground" />
                </div>

                <p className="mt-3 text-sm font-medium">
                  {search
                    ? "No teachers found"
                    : "No teachers available"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {search
                    ? "Try a different search."
                    : "There are no teachers available for this school."}
                </p>
              </div>
            )}

          {!teachersQuery.isLoading &&
            !teachersQuery.isError &&
            filteredTeachers.length > 0 && (
              <div className="divide-y">
                {filteredTeachers.map(
                  (teacher) => {
                    const teacherName =
                      getTeacherName(
                        teacher,
                      );

                    const checked =
                      selectedTeacherIds.includes(
                        teacher.id,
                      );

                    return (
                      <label
                        key={teacher.id}
                        className="
                          flex cursor-pointer
                          items-center gap-3
                          px-4 py-3
                          transition-colors
                          hover:bg-muted/50
                        "
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(
                            value,
                          ) => {
                            handleTeacherChange(
                              teacher.id,
                              value === true,
                            );
                          }}
                          disabled={
                            isAssigning ||
                            !teacher.is_active
                          }
                        />

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <UserRound className="size-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">
                              {teacherName}
                            </p>

                            {!teacher.is_active && (
                              <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                                Inactive
                              </span>
                            )}
                          </div>

                          <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                            <span className="shrink-0">
                              {teacher.employee_code}
                            </span>

                            <span className="truncate">
                              {teacher.email}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  },
                )}
              </div>
            )}
        </div>

        {/* Selection summary */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Selected teachers
          </span>

          <span className="text-sm font-semibold">
            {selectedTeacherIds.length}
          </span>
        </div>

        <Separator />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isAssigning}
            onClick={() => {
              handleOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              selectedTeacherIds.length === 0 ||
              isAssigning
            }
            onClick={() => {
              void handleAssign();
            }}
          >
            {isAssigning && (
              <Loader2 className="size-4 animate-spin" />
            )}

            {isAssigning
              ? "Assigning..."
              : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}