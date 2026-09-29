"use client";

import {
  BusFront,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { TransportBus } from "../types";

type Props = {
  bus: TransportBus;
};

function getStatusLabel(
  status: TransportBus["status"],
) {
  switch (status) {
    case "active":
      return "Active";

    case "maintenance":
      return "Maintenance";

    default:
      return "Inactive";
  }
}

function getTripLabel(
  status: TransportBus["trip_status"],
) {
  switch (status) {
    case "on_time":
      return "On time";

    case "delayed":
      return "Delayed";

    case "completed":
      return "Completed";

    default:
      return "Not started";
  }
}

export function TransportBusCard({
  bus,
}: Props) {
  const occupancy =
    bus.capacity > 0
      ? Math.round(
          (bus.occupied / bus.capacity) * 100,
        )
      : 0;

  return (
    <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
            <BusFront className="size-5" />
          </div>

          <div>
            <p className="font-semibold">
              {bus.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {bus.registration_number}
            </p>
          </div>
        </div>

        <Badge
          variant={
            bus.status === "active"
              ? "default"
              : "secondary"
          }
          className="rounded-full"
        >
          {getStatusLabel(bus.status)}
        </Badge>
      </div>

      <div className="mt-5 rounded-xl bg-muted/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {bus.route_name}
          </span>

          <Badge
            variant={
              bus.trip_status === "delayed"
                ? "destructive"
                : "secondary"
            }
            className="rounded-full"
          >
            {getTripLabel(bus.trip_status)}
          </Badge>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${occupancy}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {bus.occupied} students
          </span>

          <span>
            {bus.capacity} capacity
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center gap-2">
          <UserRound className="size-4 text-muted-foreground" />

          <span className="text-muted-foreground">
            Driver
          </span>

          <span className="ml-auto font-medium">
            {bus.driver_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />

          <span className="text-muted-foreground">
            Next stop
          </span>

          <span className="ml-auto font-medium">
            {bus.next_stop}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted-foreground" />

          <span className="text-muted-foreground">
            ETA
          </span>

          <span className="ml-auto font-medium">
            {bus.next_stop_time}
          </span>
        </div>
      </div>
    </div>
  );
}