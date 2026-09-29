"use client";

import { TransportBusCard } from "./transport-bus-card";

import type { TransportBus } from "../types";

type Props = {
  buses: TransportBus[];
};

export function TransportBusGrid({
  buses,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {buses.map((bus) => (
        <TransportBusCard
          key={bus.id}
          bus={bus}
        />
      ))}
    </div>
  );
}