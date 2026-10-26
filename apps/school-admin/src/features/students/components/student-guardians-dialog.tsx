"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  Star,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useCreateStudentGuardian,
  useDeleteStudentGuardian,
  useStudentGuardians,
} from "../hooks/use-student-guardians";
import {
  guardianSchema,
  type GuardianFormData,
} from "../schemas/guardian.schema";
import type { Student } from "../types";
import {
  GUARDIAN_RELATIONSHIP_LABELS,
  type GuardianRelationship,
  type StudentGuardian,
} from "../types/guardian";

type Props = {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type View =
  | { type: "list" }
  | { type: "add" }
  | { type: "detail"; guardian: StudentGuardian };

/* ── helpers ─────────────────────────────────────────────────────── */

function getStudentName(student: Student) {
  return [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");
}

function getGuardianName(guardian: StudentGuardian) {
  return `${guardian.first_name} ${guardian.last_name}`.trim();
}

function getGuardianInitials(guardian: StudentGuardian) {
  return `${guardian.first_name.charAt(0)}${guardian.last_name.charAt(0)}`.toUpperCase();
}

const DEFAULT_VALUES: GuardianFormData = {
  first_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  occupation: "",
  relationship_type: "GUARDIAN",
  is_primary_contact: false,
};

/* ── component ───────────────────────────────────────────────────── */

export function StudentGuardiansDialog({ student, open, onOpenChange }: Props) {
  const [view, setView] = useState<View>({ type: "list" });

  const [guardianToDelete, setGuardianToDelete] =
    useState<StudentGuardian | null>(null);

  const studentId = student?.id ?? "";

  const guardiansQuery = useStudentGuardians(open ? studentId || null : null);
  const createMutation = useCreateStudentGuardian(studentId);
  const deleteMutation = useDeleteStudentGuardian(studentId);

  // Always reopen on the list for whichever student was picked.
  useEffect(() => {
    if (open) {
      setView({ type: "list" });
      setGuardianToDelete(null);
    }
  }, [open, studentId]);

  if (!student) {
    return null;
  }

  const isBusy = createMutation.isPending || deleteMutation.isPending;
  const studentName = getStudentName(student);

  function handleConfirmDelete() {
    if (!guardianToDelete || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(guardianToDelete.id, {
      onSuccess: () => {
        setGuardianToDelete(null);
        setView({ type: "list" });
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isBusy) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {view.type === "list" && (
          <>
            <DialogHeader>
              <DialogTitle>Guardians</DialogTitle>

              <DialogDescription>
                Parents and guardians linked to{" "}
                <span className="font-medium text-foreground">
                  {studentName}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <GuardianList
              guardians={guardiansQuery.data ?? []}
              isLoading={guardiansQuery.isLoading}
              isError={guardiansQuery.isError}
              error={guardiansQuery.error}
              onRetry={() => {
                void guardiansQuery.refetch();
              }}
              onAdd={() => setView({ type: "add" })}
              onView={(guardian) => setView({ type: "detail", guardian })}
              onDelete={setGuardianToDelete}
            />

            {!guardiansQuery.isLoading &&
              !guardiansQuery.isError &&
              (guardiansQuery.data?.length ?? 0) > 0 && (
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>

                  <Button type="button" onClick={() => setView({ type: "add" })}>
                    <Plus className="mr-1 size-4" />
                    Add Guardian
                  </Button>
                </DialogFooter>
              )}
          </>
        )}

        {view.type === "add" && (
          <>
            <DialogHeader>
              <DialogTitle>Add Guardian</DialogTitle>

              <DialogDescription>
                Register a parent or guardian for{" "}
                <span className="font-medium text-foreground">
                  {studentName}
                </span>
                . If the email already belongs to a parent (for example a
                sibling&apos;s), that account is linked instead. New parents
                sign in to the portal with their email as the password.
              </DialogDescription>
            </DialogHeader>

            <GuardianForm
              isPending={createMutation.isPending}
              onCancel={() => setView({ type: "list" })}
              onSubmit={async (values) => {
                await createMutation.mutateAsync(values);
                setView({ type: "list" });
              }}
            />
          </>
        )}

        {view.type === "detail" && (
          <GuardianDetail
            guardian={view.guardian}
            studentName={studentName}
            onBack={() => setView({ type: "list" })}
            onDelete={() => setGuardianToDelete(view.guardian)}
          />
        )}

        {/* ── Delete confirmation (nested) ─────────────────────── */}
        <Dialog
          open={guardianToDelete !== null}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && !deleteMutation.isPending) {
              setGuardianToDelete(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove guardian?</DialogTitle>

              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-medium text-foreground">
                  {guardianToDelete
                    ? getGuardianName(guardianToDelete)
                    : "this guardian"}
                </span>{" "}
                as a guardian of {studentName}? They will no longer receive
                updates about this student.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={deleteMutation.isPending}
                onClick={() => setGuardianToDelete(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={handleConfirmDelete}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1 size-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Guardian"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

/* ── list ────────────────────────────────────────────────────────── */

function GuardianList({
  guardians,
  isLoading,
  isError,
  error,
  onRetry,
  onAdd,
  onView,
  onDelete,
}: {
  guardians: StudentGuardian[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onAdd: () => void;
  onView: (guardian: StudentGuardian) => void;
  onDelete: (guardian: StudentGuardian) => void;
}) {
  if (isLoading) {
    return (
      <div
        className="space-y-2"
        role="status"
        aria-live="polite"
        aria-label="Loading guardians"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <Skeleton className="size-9 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center rounded-lg border p-6 text-center"
      >
        <AlertCircle className="size-7 text-destructive" />

        <h3 className="mt-3 font-semibold">Unable to load guardians</h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Guardian details could not be loaded. Please try again."}
        </p>

        <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (guardians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UsersRound className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">No guardians added</h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Add a parent or guardian so the school can reach them about this
          student.
        </p>

        <Button type="button" className="mt-4" onClick={onAdd}>
          <Plus className="mr-1 size-4" />
          Add Guardian
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Guardians">
      {guardians.map((guardian) => {
        const name = getGuardianName(guardian);

        return (
          <li
            key={guardian.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {getGuardianInitials(guardian)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate font-medium">{name}</span>

                <Badge variant="secondary">
                  {GUARDIAN_RELATIONSHIP_LABELS[guardian.relationship_type]}
                </Badge>

                {guardian.is_primary_contact && (
                  <Badge variant="outline">
                    <Star />
                    Primary
                  </Badge>
                )}
              </div>

              <div className="truncate text-xs text-muted-foreground">
                {guardian.email} · {guardian.mobile_number}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`View ${name}`}
                onClick={() => onView(guardian)}
              >
                <Eye />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${name}`}
                onClick={() => onDelete(guardian)}
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── detail ──────────────────────────────────────────────────────── */

function GuardianDetail({
  guardian,
  studentName,
  onBack,
  onDelete,
}: {
  guardian: StudentGuardian;
  studentName: string;
  onBack: () => void;
  onDelete: () => void;
}) {
  const name = getGuardianName(guardian);
  const relationship = GUARDIAN_RELATIONSHIP_LABELS[guardian.relationship_type];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Guardian Details</DialogTitle>

        <DialogDescription>
          {relationship} of {studentName}.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {getGuardianInitials(guardian)}
        </div>

        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{name}</div>

          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{relationship}</Badge>

            {guardian.is_primary_contact && (
              <Badge variant="outline">
                <Star />
                Primary contact
              </Badge>
            )}
          </div>
        </div>
      </div>

      <dl className="divide-y rounded-lg border">
        <div className="flex items-center gap-3 p-3">
          <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">Email</dt>
          <dd className="min-w-0 truncate text-sm font-medium">
            <a href={`mailto:${guardian.email}`} className="hover:underline">
              {guardian.email}
            </a>
          </dd>
        </div>

        <div className="flex items-center gap-3 p-3">
          <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            Contact number
          </dt>
          <dd className="min-w-0 truncate text-sm font-medium">
            <a href={`tel:${guardian.mobile_number}`} className="hover:underline">
              {guardian.mobile_number}
            </a>
          </dd>
        </div>

        <div className="flex items-center gap-3 p-3">
          <UsersRound className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            Relationship
          </dt>
          <dd className="text-sm font-medium">{relationship}</dd>
        </div>

        <div className="flex items-start gap-3 p-3">
          <Briefcase className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            Occupation
          </dt>
          <dd className="min-w-0 text-sm font-medium break-words">
            {guardian.occupation || (
              <span className="font-normal text-muted-foreground">
                Not provided
              </span>
            )}
          </dd>
        </div>
      </dl>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>

        <Button type="button" variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-1 size-4" />
          Remove Guardian
        </Button>
      </DialogFooter>
    </>
  );
}

/* ── form ────────────────────────────────────────────────────────── */

function GuardianForm({
  isPending,
  onCancel,
  onSubmit,
}: {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: GuardianFormData) => Promise<void>;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardianFormData>({
    resolver: zodResolver(guardianSchema),
    defaultValues: DEFAULT_VALUES,
  });

  async function submit(values: GuardianFormData) {
    setSubmitError(null);

    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to add guardian.",
      );
    }
  }

  function fieldProps(name: keyof GuardianFormData) {
    const hasError = Boolean(errors[name]);

    return {
      id: `guardian-${name}`,
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `guardian-${name}-error` : undefined,
      disabled: isPending,
    };
  }

  function fieldError(name: keyof GuardianFormData) {
    const message = errors[name]?.message;

    if (!message) {
      return null;
    }

    return (
      <p id={`guardian-${name}-error`} className="text-xs text-destructive">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guardian-first_name">First Name</Label>
          <Input
            placeholder="Rahul"
            autoComplete="given-name"
            {...fieldProps("first_name")}
            {...register("first_name")}
          />
          {fieldError("first_name")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardian-last_name">Last Name</Label>
          <Input
            placeholder="Sharma"
            autoComplete="family-name"
            {...fieldProps("last_name")}
            {...register("last_name")}
          />
          {fieldError("last_name")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardian-email">Email Address</Label>
          <Input
            type="email"
            placeholder="parent@example.com"
            autoComplete="email"
            {...fieldProps("email")}
            {...register("email")}
          />
          {fieldError("email")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardian-mobile_number">Contact Number</Label>
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            {...fieldProps("mobile_number")}
            {...register("mobile_number")}
          />
          {fieldError("mobile_number")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardian-relationship_type">Relationship</Label>
          <Controller
            control={control}
            name="relationship_type"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value as GuardianRelationship)
                }
                disabled={isPending}
              >
                <SelectTrigger
                  {...fieldProps("relationship_type")}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>

                <SelectContent position="popper" className="z-[100]">
                  {(
                    Object.keys(
                      GUARDIAN_RELATIONSHIP_LABELS,
                    ) as GuardianRelationship[]
                  ).map((value) => (
                    <SelectItem key={value} value={value}>
                      {GUARDIAN_RELATIONSHIP_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {fieldError("relationship_type")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardian-occupation">
            Occupation{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            maxLength={255}
            placeholder="Engineer"
            autoComplete="organization-title"
            {...fieldProps("occupation")}
            {...register("occupation")}
          />
          {fieldError("occupation")}
        </div>
      </div>

      <Controller
        control={control}
        name="is_primary_contact"
        render={({ field }) => (
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
              id="guardian-is_primary_contact"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              disabled={isPending}
              className="mt-0.5"
            />

            <div className="space-y-0.5">
              <Label htmlFor="guardian-is_primary_contact">
                Primary contact
              </Label>
              <p className="text-xs text-muted-foreground">
                The school contacts this guardian first. Replaces any existing
                primary contact.
              </p>
            </div>
          </div>
        )}
      />

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive dark:bg-destructive/10"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Guardian"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
