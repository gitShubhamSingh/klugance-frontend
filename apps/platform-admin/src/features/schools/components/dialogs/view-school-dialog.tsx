"use client";

import {
  AlertCircle,
  Building2,
  FileText,
  Globe2,
  Hash,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DetailField,
  DetailSection,
} from "@/components/common/detail-view";

import { useSchool } from "../../hooks";

import { SchoolDetailHeader } from "../details/school-detail-header";

import { SchoolPersonCard } from "../details/school-person-card";

interface ViewSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string | null;
}

export function ViewSchoolDialog({
  open,
  onOpenChange,
  schoolId,
}: ViewSchoolDialogProps) {
  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useSchool(
    open && schoolId
      ? schoolId
      : undefined,
  );

  const school = detail?.school;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          flex
          max-h-[92vh]
          w-[calc(100vw-2rem)]
          flex-col
          gap-0
          overflow-hidden
          p-0
          sm:max-w-5xl
        "
      >
        {/* Fixed header */}
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-5">
          <DialogTitle className="text-lg">
            School Details
          </DialogTitle>

          <DialogDescription>
            School profile, contact information and administration.
          </DialogDescription>
        </DialogHeader>

        {/* Scroll container */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading && (
            <SchoolDetailsLoading />
          )}

          {isError && (
            <SchoolDetailsError
              message={
                error instanceof Error
                  ? error.message
                  : "Unable to fetch school details."
              }
            />
          )}

          {!isLoading &&
            !isError &&
            detail &&
            school && (
              <>
                {/* Identity */}
                <div className="border-b bg-muted/20 px-6 py-6">
                  <SchoolDetailHeader
                    school={school}
                  />
                </div>

                <div className="space-y-5 p-6">
                  {/* School */}
                  <DetailSection
                    title="School Information"
                    description="Core identity and contact information registered for this school."
                  >
                    <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
                      <DetailField
                        label="School Name"
                        value={school.name}
                        icon={
                          <Building2 className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="School Code"
                        value={
                          <span className="font-mono text-xs">
                            {school.code}
                          </span>
                        }
                        icon={
                          <Hash className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Email Address"
                        value={
                          school.email ? (
                            <a
                              href={`mailto:${school.email}`}
                              className="hover:text-primary hover:underline"
                            >
                              {school.email}
                            </a>
                          ) : undefined
                        }
                        icon={
                          <Mail className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Mobile Number"
                        value={
                          school.mobile_number ? (
                            <a
                              href={`tel:${school.mobile_number}`}
                              className="hover:text-primary hover:underline"
                            >
                              {school.mobile_number}
                            </a>
                          ) : undefined
                        }
                        icon={
                          <Phone className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="Website"
                        value={
                          school.website ? (
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {school.website}
                            </a>
                          ) : undefined
                        }
                        icon={
                          <Globe2 className="size-3.5" />
                        }
                      />

                      <DetailField
                        label="School ID"
                        value={
                          <span className="break-all font-mono text-xs text-muted-foreground">
                            {school.id}
                          </span>
                        }
                        icon={
                          <Hash className="size-3.5" />
                        }
                      />
                    </div>
                  </DetailSection>

                  {/* Address + Description */}
                  <div className="grid gap-5 lg:grid-cols-2">
                    <DetailSection
                      title="Address"
                      description="Registered location of the school."
                    >
                      <div className="flex gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <MapPin className="size-4 text-muted-foreground" />
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {school.address || (
                            <span className="text-muted-foreground">
                              No address available
                            </span>
                          )}
                        </p>
                      </div>
                    </DetailSection>

                    <DetailSection
                      title="Description"
                      description="Additional information about the school."
                    >
                      <div className="flex gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <FileText className="size-4 text-muted-foreground" />
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {school.description || (
                            <span className="text-muted-foreground">
                              No description available
                            </span>
                          )}
                        </p>
                      </div>
                    </DetailSection>
                  </div>

                  {/* Administration */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold">
                        School Administration
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Owner and principal responsible for this school.
                      </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <SchoolPersonCard
                        title="School Owner"
                        type="owner"
                        person={detail.owner}
                      />

                      <SchoolPersonCard
                        title="Principal"
                        type="principal"
                        person={detail.principal}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SchoolDetailsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-5">
        <div className="size-20 shrink-0 animate-pulse rounded-2xl bg-muted" />

        <div className="flex-1 space-y-3">
          <div className="h-6 w-56 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <div className="mb-6 space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3 w-72 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />

              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({
          length: 2,
        }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}

function SchoolDetailsError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </div>

        <h3 className="mt-4 text-sm font-semibold">
          Unable to load school
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}