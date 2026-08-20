"use client";

import type {
  SchoolAdminRole,
} from "../../types";

interface RolesCellProps {
  roles: SchoolAdminRole[];
}

export function RolesCell({
  roles,
}: RolesCellProps) {
  if (!roles.length) {
    return (
      <span className="text-xs text-muted-foreground">
        No roles assigned
      </span>
    );
  }

  return (
    <div className="flex max-w-[280px] flex-wrap gap-1.5">
      {roles.map((role) => (
        <span
          key={role.id}
          title={role.code}
          className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground"
        >
          {role.name}
        </span>
      ))}
    </div>
  );
}