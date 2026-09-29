"use client";

import { useMemo, useState } from "react";

import { TransportHeader } from "./transport-header";
import { TransportStats } from "./transport-stats";
import { TransportFilters } from "./transport-filters";
import { TransportBusGrid } from "./transport-bus-grid";
import { TransportRouteTable } from "./transport-route-table";

import type {
  TransportBus,
  TransportRoute,
} from "../types";

const MOCK_BUSES: TransportBus[] = [
  {
    id: "bus-1",
    registration_number: "DL 01 AB 1234",
    name: "Bus 01",
    route_name: "North Campus Route",
    driver_name: "Rajesh Kumar",
    capacity: 40,
    occupied: 34,
    status: "active",
    trip_status: "on_time",
    next_stop: "Green Park",
    next_stop_time: "08:35 AM",
    last_updated: "2 min ago",
  },
  {
    id: "bus-2",
    registration_number: "DL 01 CD 5678",
    name: "Bus 02",
    route_name: "South Campus Route",
    driver_name: "Amit Sharma",
    capacity: 40,
    occupied: 37,
    status: "active",
    trip_status: "delayed",
    next_stop: "Lajpat Nagar",
    next_stop_time: "08:48 AM",
    last_updated: "1 min ago",
  },
  {
    id: "bus-3",
    registration_number: "DL 01 EF 9012",
    name: "Bus 03",
    route_name: "East Route",
    driver_name: "Suresh Singh",
    capacity: 35,
    occupied: 28,
    status: "active",
    trip_status: "on_time",
    next_stop: "Mayur Vihar",
    next_stop_time: "08:42 AM",
    last_updated: "3 min ago",
  },
  {
    id: "bus-4",
    registration_number: "DL 01 GH 3456",
    name: "Bus 04",
    route_name: "West Route",
    driver_name: "Vijay Yadav",
    capacity: 40,
    occupied: 31,
    status: "maintenance",
    trip_status: "not_started",
    next_stop: "Dwarka Sector 10",
    next_stop_time: "09:00 AM",
    last_updated: "12 min ago",
  },
  {
    id: "bus-5",
    registration_number: "DL 01 JK 7890",
    name: "Bus 05",
    route_name: "Central Route",
    driver_name: "Manoj Verma",
    capacity: 35,
    occupied: 25,
    status: "active",
    trip_status: "completed",
    next_stop: "Connaught Place",
    next_stop_time: "04:10 PM",
    last_updated: "8 min ago",
  },
  {
    id: "bus-6",
    registration_number: "DL 01 LM 2345",
    name: "Bus 06",
    route_name: "Airport Route",
    driver_name: "Ramesh Gupta",
    capacity: 40,
    occupied: 18,
    status: "inactive",
    trip_status: "not_started",
    next_stop: "Vasant Kunj",
    next_stop_time: "09:15 AM",
    last_updated: "20 min ago",
  },
];

const MOCK_ROUTES: TransportRoute[] = [
  {
    id: "route-1",
    name: "North Campus Route",
    bus_number: "DL 01 AB 1234",
    driver_name: "Rajesh Kumar",
    total_stops: 12,
    total_students: 34,
    first_pickup: "07:10 AM",
    last_drop: "08:55 AM",
    status: "active",
  },
  {
    id: "route-2",
    name: "South Campus Route",
    bus_number: "DL 01 CD 5678",
    driver_name: "Amit Sharma",
    total_stops: 14,
    total_students: 37,
    first_pickup: "07:00 AM",
    last_drop: "09:05 AM",
    status: "active",
  },
  {
    id: "route-3",
    name: "East Route",
    bus_number: "DL 01 EF 9012",
    driver_name: "Suresh Singh",
    total_stops: 10,
    total_students: 28,
    first_pickup: "07:15 AM",
    last_drop: "08:50 AM",
    status: "active",
  },
  {
    id: "route-4",
    name: "West Route",
    bus_number: "DL 01 GH 3456",
    driver_name: "Vijay Yadav",
    total_stops: 16,
    total_students: 31,
    first_pickup: "07:05 AM",
    last_drop: "09:00 AM",
    status: "maintenance",
  },
];

export function TransportPage() {
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] =
    useState<"buses" | "routes">("buses");

  const filteredBuses = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return MOCK_BUSES;
    }

    return MOCK_BUSES.filter(
      (bus) =>
        bus.name
          .toLowerCase()
          .includes(query) ||
        bus.registration_number
          .toLowerCase()
          .includes(query) ||
        bus.route_name
          .toLowerCase()
          .includes(query) ||
        bus.driver_name
          .toLowerCase()
          .includes(query),
    );
  }, [search]);

  const filteredRoutes = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return MOCK_ROUTES;
    }

    return MOCK_ROUTES.filter(
      (route) =>
        route.name
          .toLowerCase()
          .includes(query) ||
        route.bus_number
          .toLowerCase()
          .includes(query) ||
        route.driver_name
          .toLowerCase()
          .includes(query),
    );
  }, [search]);

  const totalStudents = MOCK_BUSES.reduce(
    (total, bus) =>
      total + bus.occupied,
    0,
  );

  const issues = MOCK_BUSES.filter(
    (bus) =>
      bus.trip_status === "delayed" ||
      bus.status === "maintenance",
  ).length;

  return (
    <div className="space-y-6 p-6">
      <TransportHeader />

      <TransportStats
        totalBuses={MOCK_BUSES.length}
        activeRoutes={
          MOCK_ROUTES.filter(
            (route) =>
              route.status === "active",
          ).length
        }
        studentsUsingTransport={totalStudents}
        issues={issues}
      />

      <TransportFilters
        search={search}
        onSearchChange={setSearch}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {activeView === "buses" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Fleet
              </h2>

              <p className="text-sm text-muted-foreground">
                Current status of school buses.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredBuses.length}
              </span>{" "}
              buses
            </p>
          </div>

          <TransportBusGrid
            buses={filteredBuses}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Routes
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage and monitor configured transport
              routes.
            </p>
          </div>

          <TransportRouteTable
            routes={filteredRoutes}
          />
        </div>
      )}
    </div>
  );
}