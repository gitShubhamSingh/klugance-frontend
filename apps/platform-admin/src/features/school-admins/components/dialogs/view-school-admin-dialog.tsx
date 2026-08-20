"use client";

import {
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  useSchoolAdmin,
} from "../../hooks";

interface ViewSchoolAdminDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  userId: string | null;
}

export function ViewSchoolAdminDialog({
  open,
  onOpenChange,
  userId,
}: ViewSchoolAdminDialogProps) {
  const {
    data: admin,
    isLoading,
    isError,
    error,
  } = useSchoolAdmin(
    open ? userId : null,
  );

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="School Admin Details"
      description="Account, school and access information for this administrator."
      size="lg"
    >
      {isLoading && (
        <AdminDetailsLoading />
      )}

      {isError && (
        <AdminDetailsError
          message={
            error instanceof Error
              ? error.message
              : "Unable to load school admin."
          }
        />
      )}

      {!isLoading &&
        !isError &&
        admin && (
          <AdminDetails
            admin={admin}
          />
        )}
    </BaseDialog>
  );
}

function AdminDetails({
  admin,
}: {
  admin: NonNullable<
    ReturnType<
      typeof useSchoolAdmin
    >["data"]
  >;
}) {
  const fullName = [
    admin.first_name,
    admin.middle_name,
    admin.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-xl bg-muted/30 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
          <UserRound className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">
              {fullName}
            </h3>

            <AdminStatus
              status={admin.status}
            />
          </div>

          <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
            {admin.id}
          </p>
        </div>
      </div>

      <section>
        <SectionTitle>
          Contact
        </SectionTitle>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <DetailItem
            icon={Mail}
            label="Email"
            value={admin.email}
          />

          <DetailItem
            icon={Phone}
            label="Mobile"
            value={
              admin.mobile_number
            }
          />
        </div>
      </section>

      <section>
        <SectionTitle>
          School
        </SectionTitle>

        <div className="mt-3 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <GraduationCap className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">
                {admin.school.name}
              </p>

              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {admin.school.code}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>
          Roles & Access
        </SectionTitle>

        <div className="mt-3 flex flex-wrap gap-2">
          {admin.roles.length > 0 ? (
            admin.roles.map(
              (role) => (
                <div
                  key={role.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2"
                  title={role.code}
                >
                  <ShieldCheck className="size-3.5 text-muted-foreground" />

                  <span className="text-xs font-medium">
                    {role.name}
                  </span>
                </div>
              ),
            )
          ) : (
            <span className="text-sm text-muted-foreground">
              No roles assigned.
            </span>
          )}
        </div>
      </section>

      <section>
        <SectionTitle>
          Activity
        </SectionTitle>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <DetailItem
            icon={CalendarDays}
            label="Joined"
            value={formatDateTime(
              admin.joined_at ??
                admin.created_at,
            )}
          />

          <DetailItem
            icon={CalendarDays}
            label="Last Login"
            value={
              admin.last_login_at
                ? formatDateTime(
                    admin.last_login_at,
                  )
                : "Never"
            }
          />
        </div>
      </section>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/30 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />

        {label}
      </div>

      <p className="mt-2 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h4>
  );
}

function AdminStatus({
  status,
}: {
  status: string;
}) {
  const active =
    status === "ACTIVE";

  return (
    <div
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
      }
    >
      <span
        className={
          active
            ? "size-1.5 rounded-full bg-emerald-500"
            : "size-1.5 rounded-full bg-muted-foreground"
        }
      />

      {formatStatus(status)}
    </div>
  );
}

function AdminDetailsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-xl bg-muted" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="h-20 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

function AdminDetailsError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl bg-destructive/5 p-5">
      <p className="text-sm font-medium text-destructive">
        Unable to load school admin
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

function formatStatus(
  status: string,
) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatDateTime(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}