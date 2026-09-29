"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Student } from "../types";

type Props = {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getStudentName(student: Student) {
  return [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatGender(
    gender: Student["gender"],
  ) {
    if (!gender) {
      return "—";
    }
  
    return (
      gender.charAt(0) +
      gender.slice(1).toLowerCase()
    );
  }

function formatBloodGroup(
    bloodGroup: Student["blood_group"],
  ) {
    return bloodGroup ?? "—";
  }


export function StudentProfileDialog({
  student,
  open,
  onOpenChange,
}: Props) {
  if (!student) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Student Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {student.first_name
                .charAt(0)
                .toUpperCase()}
              {student.last_name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                {getStudentName(student)}
              </h2>

              <p className="truncate text-sm text-muted-foreground">
                {student.email}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                    label="Admission Number"
                    value={student.admission_number}
                />

                <ProfileField
                    label="Mobile Number"
                    value={student.mobile_number}
                />

                <ProfileField
                    label="Email"
                    value={student.email}
                />

                <ProfileField
                    label="Date of Birth"
                    value={student.date_of_birth}
                />

                <ProfileField
                    label="Gender"
                    value={student.gender}
                />

                <ProfileField
                    label="Blood Group"
                    value={student.blood_group}
                />

                <ProfileField
                    label="Admission Date"
                    value={student.admission_date}
                />

                <ProfileField
                    label="Status"
                    value={
                    student.is_active
                        ? "Active"
                        : "Inactive"
                    }
                />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium">
        {value || "—"}
      </p>
    </div>
  );
}