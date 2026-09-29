"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

import { Textarea } from "@/components/ui/textarea";

import type { Teacher } from "../types";

import {
  useUpdateTeacher,
} from "../hooks/use-update-teacher";

type Props = {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  joining_date: string;
  employee_code: string;
  qualification: string;
  experience_years: string;
  bio: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  joining_date: "",
  employee_code: "",
  qualification: "",
  experience_years: "",
  bio: "",
};

function getFormFromTeacher(
  teacher: Teacher,
): FormState {
  return {
    first_name:
      teacher.first_name ?? "",

    middle_name:
      teacher.middle_name ?? "",

    last_name:
      teacher.last_name ?? "",

    email:
      teacher.email ?? "",

    mobile_number:
      teacher.mobile_number ?? "",

    joining_date:
      teacher.joining_date ?? "",

    employee_code:
      teacher.employee_code ?? "",

    qualification:
      teacher.qualification ?? "",

    experience_years:
      teacher.experience_years !== null &&
      teacher.experience_years !== undefined
        ? String(
            teacher.experience_years,
          )
        : "",

    bio:
      teacher.bio ?? "",
  };
}

export function EditTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: Props) {
  const [
    form,
    setForm,
  ] = useState<FormState>(
    EMPTY_FORM,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const updateTeacherMutation =
    useUpdateTeacher();

  useEffect(() => {
    if (!teacher || !open) {
      return;
    }

    setForm(
      getFormFromTeacher(teacher),
    );

    setError(null);
  }, [teacher, open]);

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validate(): string | null {
    if (!form.first_name.trim()) {
      return "First name is required.";
    }

    if (!form.last_name.trim()) {
      return "Last name is required.";
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!form.mobile_number.trim()) {
      return "Mobile number is required.";
    }

    if (!form.joining_date) {
      return "Joining date is required.";
    }

    if (!form.employee_code.trim()) {
      return "Employee code is required.";
    }

    if (form.experience_years.trim()) {
      const experience =
        Number(form.experience_years);

      if (
        !Number.isInteger(experience) ||
        experience < 0
      ) {
        return "Experience must be a valid non-negative number.";
      }
    }

    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!teacher) {
      return;
    }

    setError(null);

    const validationError =
      validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const experienceYears =
      form.experience_years.trim()
        ? Number(form.experience_years)
        : null;

    try {
      await updateTeacherMutation.mutateAsync(
        {
          teacherId: teacher.id,

          payload: {
            first_name:
              form.first_name.trim(),

            middle_name:
              form.middle_name.trim() ||
              null,

            last_name:
              form.last_name.trim(),

            email:
              form.email.trim(),

            mobile_number:
              form.mobile_number.trim(),

            joining_date:
              form.joining_date,

            employee_code:
              form.employee_code.trim(),

            qualification:
              form.qualification.trim() ||
              null,

            experience_years:
              experienceYears,

            bio:
              form.bio.trim() || null,
          },
        },
      );

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to update teacher:",
        error,
      );

      setError(
        "Unable to update teacher. Please try again.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          updateTeacherMutation.isPending
        ) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Teacher
          </DialogTitle>

          <DialogDescription>
            Update the teacher's profile and
            professional information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* Basic Information */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Basic Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Teacher's personal information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">
                  First Name
                </Label>

                <Input
                  id="edit-first-name"
                  value={form.first_name}
                  onChange={(event) =>
                    updateField(
                      "first_name",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="First name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-middle-name">
                  Middle Name
                </Label>

                <Input
                  id="edit-middle-name"
                  value={form.middle_name}
                  onChange={(event) =>
                    updateField(
                      "middle_name",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="Middle name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-last-name">
                  Last Name
                </Label>

                <Input
                  id="edit-last-name"
                  value={form.last_name}
                  onChange={(event) =>
                    updateField(
                      "last_name",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="Last name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">
                  Email
                </Label>

                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="teacher@school.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-mobile">
                  Mobile Number
                </Label>

                <Input
                  id="edit-mobile"
                  value={
                    form.mobile_number
                  }
                  onChange={(event) =>
                    updateField(
                      "mobile_number",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Employment */}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Employment Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Teacher employment and
                professional details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-employee-code">
                  Employee Code
                </Label>

                <Input
                  id="edit-employee-code"
                  value={
                    form.employee_code
                  }
                  onChange={(event) =>
                    updateField(
                      "employee_code",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="T-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-joining-date">
                  Joining Date
                </Label>

                <Input
                  id="edit-joining-date"
                  type="date"
                  value={
                    form.joining_date
                  }
                  onChange={(event) =>
                    updateField(
                      "joining_date",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-qualification">
                  Qualification
                </Label>

                <Input
                  id="edit-qualification"
                  value={
                    form.qualification
                  }
                  onChange={(event) =>
                    updateField(
                      "qualification",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="M.Ed, B.Ed, M.Sc..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-experience">
                  Experience (Years)
                </Label>

                <Input
                  id="edit-experience"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    form.experience_years
                  }
                  onChange={(event) =>
                    updateField(
                      "experience_years",
                      event.target.value,
                    )
                  }
                  disabled={
                    updateTeacherMutation.isPending
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Bio */}

          <div className="space-y-2">
            <Label htmlFor="edit-bio">
              Bio
            </Label>

            <Textarea
              id="edit-bio"
              value={form.bio}
              onChange={(event) =>
                updateField(
                  "bio",
                  event.target.value,
                )
              }
              disabled={
                updateTeacherMutation.isPending
              }
              placeholder="Enter teacher biography..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={
                updateTeacherMutation.isPending
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
                updateTeacherMutation.isPending
              }
            >
              {updateTeacherMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {updateTeacherMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}