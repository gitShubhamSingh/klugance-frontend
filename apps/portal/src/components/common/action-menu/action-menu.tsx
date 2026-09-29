"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ActionMenuItem } from "./types";

interface ActionMenuProps {
  actions: ActionMenuItem[];
}

export function ActionMenu({
  actions,
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44"
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <DropdownMenuItem
              key={action.label}
              disabled={action.disabled}
              onClick={action.onClick}
              className={
                action.destructive
                  ? "text-destructive focus:text-destructive"
                  : ""
              }
            >
              <Icon className="mr-2 h-4 w-4" />

              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}