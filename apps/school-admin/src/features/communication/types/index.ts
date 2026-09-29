export type CommunicationStatus =
  | "sent"
  | "scheduled"
  | "draft"
  | "failed";

export type CommunicationAudience =
  | "all"
  | "teachers"
  | "parents"
  | "students"
  | "class"
  | "section";

export type CommunicationChannel =
  | "announcement"
  | "message"
  | "email"
  | "notification";

export type CommunicationPriority =
  | "normal"
  | "important"
  | "urgent";

export type Communication = {
  id: string;
  title: string;
  message: string;

  channel: CommunicationChannel;
  audience: CommunicationAudience;

  class_name: string | null;
  section_name: string | null;

  priority: CommunicationPriority;
  status: CommunicationStatus;

  recipients: number;
  delivered: number;
  read: number;

  created_at: string;
  scheduled_at: string | null;
};