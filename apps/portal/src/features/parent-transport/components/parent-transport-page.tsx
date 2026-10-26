"use client";

import { Bus, CheckCircle2, MapPin, Phone, Route, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import type { ParentTransport, ParentTrip } from "@/features/dashboard/types/parent-dashboard";
import {
  ChildSwitcher,
  LoadErrorState,
  NoChildrenState,
  childName,
  useSelectedChild,
} from "@/features/parent-children";
import { timeLabel } from "@/features/communication/lib/chat-utils";
import { formatTime } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { useParentTransport } from "../hooks/use-parent-transport";

const tripStatusLabels: Record<ParentTrip["status"], string> = {
  NOT_STARTED: "Not started",
  STARTED: "On the way",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function ParentTransportPage() {
  const dateKey = toLocalDateKey(new Date());
  const { childrenQuery, children, child, setChildId } = useSelectedChild();
  const transportQuery = useParentTransport(child?.student_profile_id ?? null, dateKey);
  const data = transportQuery.data;

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transport</h1>
            <p className="mt-2 text-muted-foreground">
              {child ? `School bus details for ${childName(child)}` : "School bus details"}
            </p>
          </div>
          <ChildSwitcher options={children} value={child?.student_profile_id ?? null} onChange={setChildId} />
        </div>

        {childrenQuery.isLoading || (child && transportQuery.isLoading) ? (
          <div className="grid gap-4 lg:grid-cols-3" role="status" aria-label="Loading transport">
            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : childrenQuery.isError ? (
          <LoadErrorState
            title="Unable to load your children"
            message={getErrorMessage(childrenQuery.error)}
            onRetry={() => void childrenQuery.refetch()}
          />
        ) : !child ? (
          <NoChildrenState />
        ) : transportQuery.isError || !data ? (
          <LoadErrorState
            title="Unable to load transport"
            message={getErrorMessage(transportQuery.error)}
            onRetry={() => void transportQuery.refetch()}
          />
        ) : !data.assigned ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <Bus className="mx-auto size-7 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">No school transport</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {child.first_name} isn&apos;t assigned to a school bus route. Contact the school office to sign up.
            </p>
          </div>
        ) : (
          <TransportDetails data={data} />
        )}
      </div>
    </PageContainer>
  );
}

function TransportDetails({ data }: { data: ParentTransport }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border bg-card p-5 lg:col-span-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <Route className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold">
              {data.route_name} {data.route_code && <span className="text-muted-foreground">· {data.route_code}</span>}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {data.start_location} → {data.end_location}
            </p>
          </div>
        </div>

        <ol className="mt-6 space-y-0">
          {data.stops.map((stop, i) => {
            const mine = stop.is_pickup || stop.is_drop;
            return (
              <li key={stop.id} className="relative flex gap-4 pb-5 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "z-10 flex size-7 items-center justify-center rounded-full border-2 bg-card text-2xs font-semibold",
                      mine ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                    )}
                  >
                    {mine ? <MapPin className="size-3.5" /> : stop.sequence}
                  </span>
                  {i < data.stops.length - 1 && <span className="absolute top-7 -bottom-0 w-0.5 bg-border" />}
                </div>
                <div className={cn("flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl px-3 py-1", mine && "bg-muted/60")}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{stop.name}</p>
                    {mine && (
                      <p className="text-xs text-muted-foreground">
                        {[stop.is_pickup && "Pickup stop", stop.is_drop && "Drop stop"].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                    {formatTime(stop.pickup_time)} / {formatTime(stop.drop_time)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-2xs text-muted-foreground">Times shown as pickup / drop.</p>
      </section>

      <div className="space-y-6">
        <section className="rounded-2xl border bg-card p-5">
          <p className="text-sm font-medium">Bus & driver</p>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Bus className="size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Bus</dt>
                <dd className="font-medium">
                  {data.bus_number ?? "—"}
                  {data.bus_registration && <span className="ml-1.5 text-xs text-muted-foreground">{data.bus_registration}</span>}
                </dd>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserRound className="size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Driver</dt>
                  <dd className="font-medium">{data.driver_name ?? "Not assigned"}</dd>
                </div>
              </div>
              {data.driver_phone && (
                <a
                  href={`tel:${data.driver_phone.replace(/\s/g, "")}`}
                  aria-label={`Call ${data.driver_name ?? "driver"}`}
                  className={buttonVariants({ variant: "outline", size: "icon-sm" })}
                >
                  <Phone />
                </a>
              )}
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <p className="text-sm font-medium">Today&apos;s trips</p>
          {data.today_trips.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No trips recorded today yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.today_trips.map((trip) => (
                <li key={trip.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{trip.direction === "PICKUP" ? "Morning pickup" : "Afternoon drop"}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-2xs font-medium">{tripStatusLabels[trip.status]}</span>
                  </div>
                  <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {trip.boarded_at && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Boarded {timeLabel(trip.boarded_at)}
                      </span>
                    )}
                    {trip.dropped_at && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Dropped {timeLabel(trip.dropped_at)}
                      </span>
                    )}
                    {!trip.boarded_at && !trip.dropped_at && <span>Not scanned yet</span>}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
