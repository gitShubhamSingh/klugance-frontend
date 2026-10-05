"use client";

import {
    useEffect,
    useState,
  } from "react";
  
//   import {
//     useQueryClient,
//   } from "@tanstack/react-query";

import {
  Check,
  Loader2,
  Users,
} from "lucide-react";

import { toast } from "sonner";

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

import { useSubjectClassTeachers } from "../hooks/use-subject-class-teachers";

import {
  useCreateSubjectTeacherAssignment,
} from "../hooks/use-create-subject-teacher-assignment";

import {
  useSubjectTeacherAssignments,
} from "../hooks/use-subject-teacher-assignments";

import type {
  SubjectClassTeacher,
} from "../types/subject-class-teacher";

// import {
//     subjectQueryKeys,
//   } from "../api/query-keys";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  subjectId: string;

  subjectName: string;

  classId: string;

  className: string;

  sectionId: string;

  academicYearId: string;
};

function getTeacherName(
  teacher: SubjectClassTeacher,
): string {
  return [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function AssignSubjectTeacherDialog({
  open,
  onOpenChange,
  subjectId,
  subjectName,
  classId,
  className,
  sectionId,
  academicYearId,
}: Props) {
  
//   const queryClient = useQueryClient();

  const [
    selectedTeacherIds,
    setSelectedTeacherIds,
  ] = useState<string[]>([]);

  const teachersQuery =
    useSubjectClassTeachers(
      classId,
      open,
    );

  const assignedTeachersQuery =
    useSubjectTeacherAssignments(
      subjectId,
      open,
    );

  const assignmentMutation =
    useCreateSubjectTeacherAssignment();

  useEffect(() => {
    if (!open) {
      setSelectedTeacherIds([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      assignedTeachersQuery.isLoading ||
      assignedTeachersQuery.isError
    ) {
      return;
    }

    const assignedTeacherIds =
      (
        assignedTeachersQuery.data ?? []
      )
        .map(
          (assignment) =>
            assignment.teacher_profile_id,
        )
        .filter(
          (
            teacherId,
          ): teacherId is string =>
            Boolean(teacherId),
        );

    setSelectedTeacherIds(
      assignedTeacherIds,
    );
  }, [
    open,
    assignedTeachersQuery.data,
    assignedTeachersQuery.isLoading,
    assignedTeachersQuery.isError,
  ]);

  function toggleTeacher(
    teacherId: string,
    checked: boolean,
  ) {
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
  }

  async function handleAssign() {
    if (!subjectId) {
      toast.error(
        "Subject is missing.",
      );
  
      return;
    }
  
    if (
      selectedTeacherIds.length === 0
    ) {
      toast.error(
        "Please select at least one teacher.",
      );
  
      return;
    }
  
    const payload = {
      subject_id: subjectId,
      teacher_ids:
        selectedTeacherIds,
    };
  
    try {
        await assignmentMutation.mutateAsync({
          classId,
          payload
        });
        
        
        toast.success(
        "Teachers assigned to subject successfully.",
        );
        
        setSelectedTeacherIds([]);
        
        onOpenChange(false);
    } catch (error) {
      console.error(
        "Teacher-subject assignment failed:",
        error,
      );
  
      toast.error(
        "Failed to assign teachers to subject.",
      );
    }
  }
  const teachers =
    teachersQuery.data ?? [];

  const isLoading =
    teachersQuery.isLoading ||
    assignedTeachersQuery.isLoading;

  const isError =
    teachersQuery.isError ||
    assignedTeachersQuery.isError;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          assignmentMutation.isPending
        ) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Available Teachers to the Class
          </DialogTitle>

          <DialogDescription>
            Select teachers available to{" "}
            <span className="font-medium text-foreground">
              {className}
            </span>{" "}
            for the subject{" "}
            <span className="font-medium text-foreground">
              {subjectName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[360px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading teachers...
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <Users className="size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                Failed to load teachers
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please try again.
              </p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <Users className="size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No teachers available
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                There are no teachers assigned to
                this class.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {teachers.map(
                (teacher) => {
                  const checked =
                    selectedTeacherIds.includes(
                      teacher.id,
                    );

                  return (
                    <div
                      key={teacher.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        toggleTeacher(
                          teacher.id,
                          !checked,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();

                          toggleTeacher(
                            teacher.id,
                            !checked,
                          );
                        }
                      }}
                      className={[
                        "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        checked
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(
                          value,
                        ) => {
                          toggleTeacher(
                            teacher.id,
                            value === true,
                          );
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      />

                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {teacher.first_name?.charAt(
                          0,
                        )}
                        {teacher.last_name?.charAt(
                          0,
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {getTeacherName(
                            teacher,
                          )}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {
                            teacher.employee_code
                          }
                        </p>
                      </div>

                      {checked && (
                        <Check className="size-4 text-primary" />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={
              assignmentMutation.isPending
            }
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              selectedTeacherIds.length ===
                0 ||
              assignmentMutation.isPending ||
              isLoading
            }
            onClick={handleAssign}
          >
            {assignmentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

