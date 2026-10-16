"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTimetableClassSubjects } from "../hooks/use-class-subjects";
import { useTimetableClassTeachers } from "../hooks/use-class-teachers";
import { useCreateTeacherAssignment } from "../hooks/use-create-teacher-assignment";
import { useCreateTimetable } from "../hooks/use-create-timetable";


import { getTeacherAssignments } from "../api/get-teacher-assignments";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  sectionId: string;
  periodId: string;
  day: string;
  academicYearId: string;
};

type FormValues = {
  classSubjectId: string;
  teacherId: string;
};

export function AssignTimetableDialog({
  open,
  onOpenChange,
  classId,
  sectionId,
  periodId,
  day,
  academicYearId,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      classSubjectId: "",
      teacherId: "",
    },
  });

  const selectedClassSubjectId = form.watch("classSubjectId");

  const classSubjectsQuery =
    useTimetableClassSubjects(classId);

  const classTeachersQuery =
    useTimetableClassTeachers(classId);

  const createTeacherAssignmentMutation =
    useCreateTeacherAssignment();

  const createTimetableMutation =
    useCreateTimetable();

  const availableTeachers =
    classTeachersQuery.data ?? [];

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: FormValues) {
    try {
      const assignments = await getTeacherAssignments();
  
      const existingAssignment = assignments.find(
        (assignment) =>
          assignment.teacher_profile_id === values.teacherId &&
          assignment.class_subject_id === values.classSubjectId &&
          assignment.section_id === sectionId &&
          assignment.academic_year_id === academicYearId,
      );
  
      const teacherAssignmentId =
        existingAssignment?.id ??
        (
          await createTeacherAssignmentMutation.mutateAsync({
            teacher_id: values.teacherId,
            class_subject_id: values.classSubjectId,
            section_id: sectionId,
            academic_year_id: academicYearId,
          })
        ).id;
  
      await createTimetableMutation.mutateAsync({
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
        teacher_assignment_id: teacherAssignmentId,
        period_id: periodId,
        day_of_week: day,
        effective_from: new Date().toISOString().slice(0, 10),
        effective_to: new Date().toISOString().slice(0, 10),
      });
  
      toast.success("Timetable assigned successfully.");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Failed to assign timetable:", error);
      toast.error("Failed to assign timetable. Please try again.");
    }
  }

  const isSubmitting =
    createTeacherAssignmentMutation.isPending ||
    createTimetableMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Assign Timetable
          </DialogTitle>

          <DialogDescription>
            Select the subject and teacher for this
            timetable period.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="classSubjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue(
                        "teacherId",
                        "",
                      );
                    }}
                    disabled={
                      classSubjectsQuery.isLoading ||
                      isSubmitting
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            classSubjectsQuery.isLoading
                              ? "Loading subjects..."
                              : "Select subject"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="z-[100]">
                      {(
                        classSubjectsQuery.data ?? []
                      ).map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                        >
                          {item.subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Teacher
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !selectedClassSubjectId ||
                      classTeachersQuery.isFetching ||
                      isSubmitting
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedClassSubjectId
                              ? "Select subject first"
                              : classTeachersQuery.isFetching
                                ? "Loading teachers..."
                                : availableTeachers.length ===
                                    0
                                  ? "No teachers available"
                                  : "Select teacher"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="z-[100]">
                      {availableTeachers.length ===
                      0 ? (
                        <SelectItem
                          value="no-teachers"
                          disabled
                        >
                          No teachers available
                        </SelectItem>
                      ) : (
                        availableTeachers.map(
                          (teacher) => (
                            <SelectItem
                              key={teacher.id}
                              value={teacher.id}
                            >
                              {[
                                teacher.first_name,
                                teacher.middle_name,
                                teacher.last_name,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </SelectItem>
                          ),
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !form.watch("classSubjectId") ||
                  !form.watch("teacherId") ||
                  isSubmitting
                }
              >
                {isSubmitting
                  ? "Assigning..."
                  : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}