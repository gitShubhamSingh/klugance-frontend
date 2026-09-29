"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useTeacher } from "../hooks/use-teacher";

type Props = {
  teacherId: string | null;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function getTeacherName(
  teacher:
    | {
        first_name: string;
        middle_name: string | null;
        last_name: string;
      }
    | undefined,
) {
  if (!teacher) {
    return "Teacher";
  }

  return [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export function TeacherProfileDialog({
  teacherId,
  open,
  onOpenChange,
}: Props) {
  const {
    data: teacher,
    isLoading,
    isError,
  } = useTeacher(teacherId);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Teacher Profile
          </DialogTitle>

          <DialogDescription>
            View teacher employment and
            professional information.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Loading teacher profile...
              </p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <p className="font-medium text-destructive">
                Unable to load teacher profile.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please close this dialog and
                try again.
              </p>
            </div>
          </div>
        )}

        {teacher && !isLoading && !isError && (
          <div className="space-y-6">
            {/* Identity */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {teacher.first_name
                  .charAt(0)
                  .toUpperCase()}
                {teacher.last_name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold">
                  {getTeacherName(
                    teacher,
                  )}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {teacher.employee_code}
                </p>
              </div>

              <div className="ml-auto">
                <span
                  className={[
                    "inline-flex items-center rounded-full",
                    "px-2.5 py-1 text-xs font-medium",
                    "ring-1 ring-inset",
                    teacher.is_active
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-muted text-muted-foreground ring-border",
                  ].join(" ")}
                >
                  {teacher.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            {/* Contact */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Contact Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={
                    teacher.email
                  }
                />

                <InfoItem
                  icon={Phone}
                  label="Mobile Number"
                  value={
                    teacher.mobile_number
                  }
                />
              </div>
            </section>

            {/* Employment */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Employment Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Employee Code"
                  value={
                    teacher.employee_code
                  }
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Joining Date"
                  value={formatDate(
                    teacher.joining_date,
                  )}
                />

                <InfoItem
                  icon={UserRound}
                  label="User ID"
                  value={
                    teacher.user_id
                  }
                />
              </div>
            </section>

            {/* Professional */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Professional Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={GraduationCap}
                  label="Qualification"
                  value={
                    teacher.qualification ??
                    "Not available"
                  }
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={
                    teacher.experience_years !==
                    null
                      ? `${teacher.experience_years} years`
                      : "Not available"
                  }
                />
              </div>
            </section>

            {/* Bio */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Bio
              </h3>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {teacher.bio ||
                    "No bio available."}
                </p>
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type InfoItemProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
};

function InfoItem({
  icon: Icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-medium">
        {value}
      </p>
    </div>
  );
}