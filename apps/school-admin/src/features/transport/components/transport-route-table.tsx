"use client";

import {
  MoreHorizontal,
  Route,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TransportRoute } from "../types";

type Props = {
  routes: TransportRoute[];
};

export function TransportRouteTable({
  routes,
}: Props) {
  if (routes.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Route className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No routes found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Transport routes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Stops</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {route.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {route.first_pickup} →{" "}
                    {route.last_drop}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                {route.bus_number}
              </TableCell>

              <TableCell>
                {route.driver_name}
              </TableCell>

              <TableCell>
                {route.total_stops}
              </TableCell>

              <TableCell>
                {route.total_students}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    route.status === "active"
                      ? "default"
                      : "secondary"
                  }
                  className="rounded-full"
                >
                  {route.status === "active"
                    ? "Active"
                    : route.status === "maintenance"
                      ? "Maintenance"
                      : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <MoreHorizontal className="size-4" />

                      <span className="sr-only">
                        Route actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      View Route
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      View Students
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      Edit Route
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}