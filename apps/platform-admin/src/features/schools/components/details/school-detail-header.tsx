"use client";

import {
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  Phone,
} from "lucide-react";

import { School } from "../../types/school";

interface SchoolDetailHeaderProps {
  school: School;
}

export function SchoolDetailHeader({
  school,
}: SchoolDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      {/* Logo placeholder */}
      <div className="relative shrink-0">
        <div className="flex size-20 items-center justify-center rounded-2xl border bg-background shadow-sm">
          <Building2 className="size-9 text-muted-foreground" />
        </div>
      </div>

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="truncate text-2xl font-semibold tracking-tight">
            {school.name}
          </h2>

          <span className="rounded-md border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">
            {school.code}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {school.email && (
            <a
              href={`mailto:${school.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="size-3.5" />
              {school.email}
            </a>
          )}

          {school.mobile_number && (
            <a
              href={`tel:${school.mobile_number}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Phone className="size-3.5" />
              {school.mobile_number}
            </a>
          )}
        </div>

        {school.website && (
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Globe2 className="size-3.5" />

            <span className="max-w-[350px] truncate">
              {school.website}
            </span>

            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}