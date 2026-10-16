"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useAcademicYears } from "@/features/academic-years/hooks/use-academic-years";
import { useClasses } from "@/features/classes/hooks/use-classes";
import { useSections } from "@/features/sections/hooks/use-sections";

import {
  useCreateStudent,
} from "../hooks/use-create-student";

import {
  useCreateStudentEnrollment,
} from "../hooks/use-create-student-enrollment";

const createStudentSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required"),

  middle_name: z
    .string()
    .trim()
    .optional(),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  mobile_number: z
    .string()
    .trim()
    .min(
      10,
      "Mobile number must be at least 10 characters",
    )
    .max(
      15,
      "Mobile number must not exceed 15 characters",
    ),

  admission_number: z
    .string()
    .trim()
    .min(
      1,
      "Admission number is required",
    ),

  date_of_birth: z
    .string()
    .optional(),

  gender: z
    .enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ])
    .optional(),

  blood_group: z
    .enum([
      "A+",
      "A-",
      "B+",
      "B-",
      "O+",
      "O-",
      "AB+",
      "AB-",
      "N.A",
    ])
    .optional(),

  admission_date: z
    .string()
    .optional(),

  class_id: z
    .string()
    .min(
      1,
      "Class is required",
    ),

  section_id: z
    .string()
    .min(
      1,
      "Section is required",
    ),

  roll_number: z
    .string()
    .trim()
    .min(
      1,
      "Roll number is required",
    ),
});

type CreateStudentFormValues =
  z.infer<typeof createStudentSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateStudentDialog({
  open,
  onOpenChange,
}: Props) {
  const createStudentMutation =
    useCreateStudent();

  const createEnrollmentMutation =
    useCreateStudentEnrollment();

  const academicYearQuery =
    useAcademicYears();

  const academicYearId =
    academicYearQuery.data?.id ?? "";

  const classesQuery =
    useClasses(academicYearId);

  const classes =
    classesQuery.data ?? [];

  const form =
    useForm<CreateStudentFormValues>({
      resolver: zodResolver(
        createStudentSchema,
      ),

      defaultValues: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        admission_number: "",
        date_of_birth: "",
        gender: undefined,
        blood_group: undefined,
        admission_date: "",
        class_id: "",
        section_id: "",
        roll_number: "",
      },
    });

  const selectedClassId =
    form.watch("class_id");

  const sectionsQuery =
    useSections(
      selectedClassId || undefined,
    );

  const sections =
    sectionsQuery.data ?? [];

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const isPending =
    createStudentMutation.isPending ||
    createEnrollmentMutation.isPending;

  async function onSubmit(
    values: CreateStudentFormValues,
  ) {
    setSubmitError(null);

    if (!academicYearId) {
      setSubmitError(
        "Current academic year is unavailable.",
      );

      return;
    }

    try {
      /*
       * =====================================================
       * STEP 1
       * Create student profile
       * =====================================================
       */

      const student =
        await createStudentMutation.mutateAsync({
          first_name:
            values.first_name.trim(),

          middle_name:
            values.middle_name?.trim() ||
            null,

          last_name:
            values.last_name.trim(),

          email:
            values.email.trim(),

          mobile_number:
            values.mobile_number.trim(),

          admission_number:
            values.admission_number.trim(),

          date_of_birth:
            values.date_of_birth || null,

          gender:
            values.gender ?? null,

          blood_group:
            values.blood_group ?? null,

          admission_date:
            values.admission_date || null,
        });

      /*
       * =====================================================
       * STEP 2
       * Create student enrollment
       * =====================================================
       */

      await createEnrollmentMutation.mutateAsync({
        studentId: student.id,

        payload: {
          academic_year_id:
            academicYearId,

          class_id:
            values.class_id,

          section_id:
            values.section_id,

          roll_number:
            values.roll_number.trim(),

          enrollment_date:
            values.admission_date ||
            new Date()
              .toISOString()
              .split("T")[0],
        },
      });

      /*
       * =====================================================
       * SUCCESS
       * =====================================================
       */

      form.reset();

      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        getCreateStudentError(error),
      );
    }
  }

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    if (isPending) {
      return;
    }

    if (!nextOpen) {
      form.reset();

      setSubmitError(null);
    }

    onOpenChange(nextOpen);
  }

  function handleClassChange(
    classId: string,
  ) {
    form.setValue(
      "class_id",
      classId,
      {
        shouldValidate: true,
      },
    );

    /*
     * Section belongs to the selected class.
     * Therefore changing class must clear
     * the previously selected section.
     */
    form.setValue(
      "section_id",
      "",
      {
        shouldValidate: true,
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add Student
          </DialogTitle>

          <DialogDescription>
            Create a new student profile and
            enroll the student into a class
            and section.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="space-y-6"
        >
          {/* ================================================== */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Personal Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Basic student information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                required
                error={
                  form.formState.errors
                    .first_name?.message
                }
              >
                <Input
                  {...form.register(
                    "first_name",
                  )}
                  placeholder="First name"
                />
              </FormField>

              <FormField
                label="Middle Name"
                error={
                  form.formState.errors
                    .middle_name?.message
                }
              >
                <Input
                  {...form.register(
                    "middle_name",
                  )}
                  placeholder="Middle name"
                />
              </FormField>

              <FormField
                label="Last Name"
                required
                error={
                  form.formState.errors
                    .last_name?.message
                }
              >
                <Input
                  {...form.register(
                    "last_name",
                  )}
                  placeholder="Last name"
                />
              </FormField>

              <FormField
                label="Mobile Number"
                required
                error={
                  form.formState.errors
                    .mobile_number?.message
                }
              >
                <Input
                  {...form.register(
                    "mobile_number",
                  )}
                  placeholder="+91XXXXXXXXXX"
                />
              </FormField>

              <FormField
                label="Email"
                required
                error={
                  form.formState.errors
                    .email?.message
                }
              >
                <Input
                  type="email"
                  {...form.register(
                    "email",
                  )}
                  placeholder="student@example.com"
                />
              </FormField>

              <FormField
                label="Date of Birth"
                error={
                  form.formState.errors
                    .date_of_birth?.message
                }
              >
                <Input
                  type="date"
                  {...form.register(
                    "date_of_birth",
                  )}
                />
              </FormField>
            </div>
          </div>

          {/* ================================================== */}
          {/* ACADEMIC INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Academic Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Assign the student to the
                current academic year,
                class and section.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* CLASS */}

              <FormField
                label="Class"
                required
                error={
                  form.formState.errors
                    .class_id?.message
                }
              >
                <Select
                  value={
                    form.watch(
                      "class_id",
                    ) ?? ""
                  }
                  onValueChange={
                    handleClassChange
                  }
                  disabled={
                    classesQuery.isLoading ||
                    isPending
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        classesQuery.isLoading
                          ? "Loading classes..."
                          : "Select class"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="z-[100]"
                  >
                    {classes.map(
                      (schoolClass) => (
                        <SelectItem
                          key={
                            schoolClass.id
                          }
                          value={
                            schoolClass.id
                          }
                        >
                          {
                            schoolClass.name
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormField>

              {/* SECTION */}

              <FormField
                label="Section"
                required
                error={
                  form.formState.errors
                    .section_id?.message
                }
              >
                <Select
                  value={
                    form.watch(
                      "section_id",
                    ) ?? ""
                  }
                  onValueChange={(
                    value,
                  ) =>
                    form.setValue(
                      "section_id",
                      value,
                      {
                        shouldValidate:
                          true,
                      },
                    )
                  }
                  disabled={
                    !selectedClassId ||
                    sectionsQuery.isLoading ||
                    isPending
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedClassId
                          ? "Select class first"
                          : sectionsQuery.isLoading
                            ? "Loading sections..."
                            : "Select section"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="z-[100]"
                  >
                    {sections.map(
                      (section) => (
                        <SelectItem
                          key={
                            section.id
                          }
                          value={
                            section.id
                          }
                        >
                          {
                            section.name
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormField>

              {/* ROLL NUMBER */}

              <FormField
                label="Roll Number"
                required
                error={
                  form.formState.errors
                    .roll_number?.message
                }
              >
                <Input
                  {...form.register(
                    "roll_number",
                  )}
                  placeholder="001"
                  disabled={isPending}
                />
              </FormField>
            </div>
          </div>

          {/* ================================================== */}
          {/* ADMISSION INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Admission Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Student admission details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Admission Number"
                required
                error={
                  form.formState.errors
                    .admission_number
                    ?.message
                }
              >
                <Input
                  {...form.register(
                    "admission_number",
                  )}
                  placeholder="ADM-001"
                  disabled={isPending}
                />
              </FormField>

              <FormField
                label="Admission Date"
                error={
                  form.formState.errors
                    .admission_date
                    ?.message
                }
              >
                <Input
                  type="date"
                  {...form.register(
                    "admission_date",
                  )}
                  disabled={isPending}
                />
              </FormField>

              <FormField
                label="Gender"
                error={
                  form.formState.errors
                    .gender?.message
                }
              >
                <Select
                  value={
                    form.watch(
                      "gender",
                    ) ?? ""
                  }
                  onValueChange={(
                    value,
                  ) => {
                    form.setValue(
                      "gender",
                      value as
                        | "MALE"
                        | "FEMALE"
                        | "OTHER",
                      {
                        shouldValidate:
                          true,
                      },
                    );
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="z-[100]"
                  >
                    <SelectItem value="MALE">
                      Male
                    </SelectItem>

                    <SelectItem value="FEMALE">
                      Female
                    </SelectItem>

                    <SelectItem value="OTHER">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Blood Group"
                error={
                  form.formState.errors
                    .blood_group?.message
                }
              >
                <Select
                  value={
                    form.watch(
                      "blood_group",
                    ) ?? ""
                  }
                  onValueChange={(
                    value,
                  ) => {
                    form.setValue(
                      "blood_group",
                      value as
                        | "N.A"
                        | "A+"
                        | "A-"
                        | "B+"
                        | "B-"
                        | "O+"
                        | "O-"
                        | "AB+"
                        | "AB-",
                      {
                        shouldValidate:
                          true,
                      },
                    );
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="z-[100]"
                  >
                    <SelectItem value="A+">
                      A+
                    </SelectItem>

                    <SelectItem value="A-">
                      A-
                    </SelectItem>

                    <SelectItem value="B+">
                      B+
                    </SelectItem>

                    <SelectItem value="B-">
                      B-
                    </SelectItem>

                    <SelectItem value="O+">
                      O+
                    </SelectItem>

                    <SelectItem value="O-">
                      O-
                    </SelectItem>

                    <SelectItem value="AB+">
                      AB+
                    </SelectItem>

                    <SelectItem value="AB-">
                      AB-
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* ================================================== */}
          {/* ERROR */}
          {/* ================================================== */}

          {submitError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                {submitError}
              </p>
            </div>
          )}

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                handleOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Creating..."
                : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>

      {children}

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function getCreateStudentError(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.detail ??
      response?.data?.message ??
      "Unable to create student."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to create student.";
}