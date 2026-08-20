"use client";

import {
  Mail,
  Phone,
  ShieldUser,
  UserRound,
} from "lucide-react";

import { SchoolPerson } from "../../types/school-detail";

interface SchoolPersonCardProps {
  title: string;
  person: SchoolPerson | null;
  type: "owner" | "principal";
}

export function SchoolPersonCard({
  title,
  person,
  type,
}: SchoolPersonCardProps) {
  const Icon =
    type === "owner"
      ? ShieldUser
      : UserRound;

  if (!person) {
    return (
      <div className="rounded-xl bg-muted/20">
        <div className="px-5 pt-5">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              {title}
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              No information available
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fullName = [
    person.first_name,
    person.middle_name,
    person.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold">
            {title}
          </h3>
        </div>
      </div>

      {/* Profile */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {person.profile_picture ? (
              <img
                src={person.profile_picture}
                alt={fullName}
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-6 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">
              {fullName}
            </p>

            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {person.id}
            </p>

            <div className="mt-4 space-y-2.5">
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />

                  <span className="truncate">
                    {person.email}
                  </span>
                </a>
              )}

              {person.mobile_number && (
                <a
                  href={`tel:${person.mobile_number}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />

                  {person.mobile_number}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}