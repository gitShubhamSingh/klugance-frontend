export type TransportStatus =
  | "active"
  | "inactive"
  | "maintenance";

export type TripStatus =
  | "on_time"
  | "delayed"
  | "completed"
  | "not_started";

export type TransportBus = {
  id: string;
  registration_number: string;
  name: string;

  route_name: string;
  driver_name: string;

  capacity: number;
  occupied: number;

  status: TransportStatus;
  trip_status: TripStatus;

  next_stop: string;
  next_stop_time: string;

  last_updated: string;
};

export type TransportRoute = {
  id: string;
  name: string;

  bus_number: string;
  driver_name: string;

  total_stops: number;
  total_students: number;

  first_pickup: string;
  last_drop: string;

  status: TransportStatus;
};

export type TransportStudent = {
  id: string;

  name: string;
  admission_number: string;

  class_name: string;
  section_name: string;

  route_name: string;

  pickup_point: string;
  drop_point: string;

  bus_number: string;

  transport_status: "assigned" | "unassigned";
};