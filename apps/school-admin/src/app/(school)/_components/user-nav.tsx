"use client";

import {
  LogOut,
  UserRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  sessionService,
  useAuthStore,
} from "@/core/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(
  firstName: string,
  lastName: string,
) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`
    .toUpperCase();
}

export function UserNav() {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  if (!user) {
    return null;
  }

  const fullName = [
    user.first_name,
    user.middle_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const primaryRole =
    user.roles[0];

  const handleLogout =
    async () => {
      try {
        await sessionService.logout();
      } finally {
        router.replace("/login");
      }
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-10 gap-2 px-2"
          />
        }
      >
        <Avatar className="size-8">
          {user.profile_picture && (
            <AvatarImage
              src={user.profile_picture}
              alt={fullName}
            />
          )}

          <AvatarFallback className="text-xs">
            {getInitials(
              user.first_name,
              user.last_name,
            )}
          </AvatarFallback>
        </Avatar>

        <div className="hidden max-w-40 text-left md:block">
          <div className="truncate text-sm font-medium">
            {fullName}
          </div>

          <div className="truncate text-xs text-muted-foreground">
            {primaryRole?.name ??
              "School Admin"}
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        {/* User information.
            Do NOT use DropdownMenuLabel here with
            the current Base UI implementation. */}
        <div className="px-2 py-2">
          <div className="truncate text-sm font-medium">
            {fullName}
          </div>

          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {user.email}
          </div>

          {user.school && (
            <div className="mt-2 truncate text-xs text-muted-foreground">
              {user.school.name}
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push("/profile")
          }
        >
          <UserRound className="size-4" />

          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />

          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}