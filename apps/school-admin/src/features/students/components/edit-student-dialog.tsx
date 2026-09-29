"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Button,
} from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Student,
} from "../types";

import {
  useUpdateStudent,
} from "../hooks/use-update-student";

import type {
  UpdateStudentPayload,
} from "../api/update-student";

type Props = {
  student: Student | null;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
};

type FormValues = {
  first_name: string;
  middle_name: string;
  last_name: string;

  email: string;
  mobile_number: string;

  date_of_birth: string;

  gender:
    | "MALE"
    | "FEMALE"
    | "OTHER"
    | "";

  blood_group:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "O+"
    | "O-"
    | "AB+"
    | "AB-"
    | "";

  admission_date: string;
};

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
}: Props) {
  const updateStudentMutation =
    useUpdateStudent();

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
    },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      date_of_birth: "",
      gender: "",
      blood_group: "",
      admission_date: "",
    },
  });

  /*
   * Populate form whenever another student
   * is selected.
   */
  useEffect(() => {
    if (!student) {
      return;
    }

    reset({
      first_name:
        student.first_name ?? "",

      middle_name:
        student.middle_name ?? "",

      last_name:
        student.last_name ?? "",

      email:
        student.email ?? "",

      mobile_number:
        student.mobile_number ?? "",

      date_of_birth:
        student.date_of_birth ?? "",

      gender:
        student.gender ?? "",

      blood_group:
        student.blood_group ?? "",

      admission_date:
        student.admission_date ?? "",
    });

    setSubmitError(null);
  }, [
    student,
    reset,
  ]);

  const gender = watch("gender");

  const bloodGroup =
    watch("blood_group");

  async function onSubmit(
    values: FormValues,
  ) {
    if (!student) {
      return;
    }

    setSubmitError(null);

    const payload: UpdateStudentPayload =
      {
        first_name:
          values.first_name.trim(),

        middle_name:
          values.middle_name.trim() ||
          null,

        last_name:
          values.last_name.trim(),

        email:
          values.email.trim(),

        mobile_number:
          values.mobile_number.trim(),

        date_of_birth:
          values.date_of_birth ||
          null,

        gender:
          values.gender || null,

        blood_group:
          values.blood_group || null,

        admission_date:
          values.admission_date ||
          null,
      };

    try {
      await updateStudentMutation.mutateAsync(
        {
          studentId: student.id,
          payload,
        },
      );

      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to update student.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          updateStudentMutation.isPending
        ) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-2xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Edit Student
          </DialogTitle>

          <DialogDescription>
            Update the student's profile
            information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
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
                Update the student's basic
                information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">
                  First Name
                </Label>

                <Input
                  id="edit-first-name"
                  {...register(
                    "first_name",
                    {
                      required:
                        "First name is required.",
                    },
                  )}
                />

                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {
                      errors.first_name
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-middle-name">
                  Middle Name
                </Label>

                <Input
                  id="edit-middle-name"
                  {...register(
                    "middle_name",
                  )}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-last-name">
                  Last Name
                </Label>

                <Input
                  id="edit-last-name"
                  {...register(
                    "last_name",
                    {
                      required:
                        "Last name is required.",
                    },
                  )}
                />

                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {
                      errors.last_name
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Admission Number - READ ONLY */}
              <div className="space-y-2">
                <Label htmlFor="edit-admission-number">
                  Admission Number
                </Label>

                <Input
                  id="edit-admission-number"
                  value={
                    student?.admission_number ??
                    ""
                  }
                  disabled
                />

                <p className="text-xs text-muted-foreground">
                  Admission number cannot be
                  changed.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* CONTACT INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Contact Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Update the student's contact
                details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="edit-email">
                  Email
                </Label>

                <Input
                  id="edit-email"
                  type="email"
                  {...register(
                    "email",
                    {
                      required:
                        "Email is required.",
                    },
                  )}
                />

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {
                      errors.email
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="edit-mobile">
                  Mobile Number
                </Label>

                <Input
                  id="edit-mobile"
                  {...register(
                    "mobile_number",
                    {
                      required:
                        "Mobile number is required.",
                    },
                  )}
                />

                {errors.mobile_number && (
                  <p className="text-xs text-destructive">
                    {
                      errors
                        .mobile_number
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* STUDENT INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Student Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Update admission and personal
                details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="edit-date-of-birth">
                  Date of Birth
                </Label>

                <Input
                  id="edit-date-of-birth"
                  type="date"
                  {...register(
                    "date_of_birth",
                  )}
                />
              </div>

              {/* Admission Date */}
              <div className="space-y-2">
                <Label htmlFor="edit-admission-date">
                  Admission Date
                </Label>

                <Input
                  id="edit-admission-date"
                  type="date"
                  {...register(
                    "admission_date",
                  )}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>
                  Gender
                </Label>

                <Select
                  value={gender}
                  onValueChange={(
                    value,
                  ) =>
                    setValue(
                      "gender",
                      value as FormValues["gender"],
                    )
                  }
                >
                  <SelectTrigger className="w-full">
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
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label>
                  Blood Group
                </Label>

                <Select
                  value={bloodGroup}
                  onValueChange={(
                    value,
                  ) =>
                    setValue(
                      "blood_group",
                      value as FormValues["blood_group"],
                    )
                  }
                >
                  <SelectTrigger className="w-full">
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
              </div>
            </div>
          </div>

          {/* ERROR */}
          {submitError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                {submitError}
              </p>
            </div>
          )}

          {/* FOOTER */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={
                updateStudentMutation.isPending
              }
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateStudentMutation.isPending
              }
            >
              {updateStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}