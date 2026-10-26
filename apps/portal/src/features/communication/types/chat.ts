/*
 * API shapes — mirror backend_v2 communication schemas
 * (app/modules/communication/schemas/message_schemas.py).
 * from_me / unread_count / status are relative to the signed-in user.
 */

/** SCHOOL = the school office inbox every school admin shares. */
export type ChatRole = "SCHOOL" | "TEACHER" | "PARENT" | "STUDENT";

export type ConversationType = "DIRECT" | "SCHOOL";

/** WhatsApp ticks: ✓ sent, ✓✓ delivered, blue ✓✓ read. */
export type DeliveryStatus = "SENT" | "DELIVERED" | "READ";

export type ChatPerson = {
  role: ChatRole;
  /** null for the school office. */
  user_id: string | null;
  name: string;
  subtitle: string | null;
  avatar_url: string | null;
};

export type ChatContact = ChatPerson & {
  /** The existing chat with this contact, if any. */
  conversation_id: string | null;
};

export type ChatSender = {
  user_id: string;
  name: string;
  role: ChatRole;
  /** e.g. "Principal" on school office messages. */
  title: string | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender: ChatSender;
  /** Sent from my side (for admins: by any admin). */
  from_me: boolean;
  /** Written by me personally. */
  sent_by_me: boolean;
  body: string;
  /** UTC ISO timestamp (no zone suffix). */
  created_at: string;
  /** Only on messages from my side. */
  status: DeliveryStatus | null;
};

export type ConversationSummary = {
  id: string;
  type: ConversationType;
  counterpart: ChatPerson;
  last_message: ChatMessage | null;
  last_message_at: string;
  unread_count: number;
  created_at: string;
};

export type ConversationList = {
  conversations: ConversationSummary[];
  total_unread: number;
};

export type ConversationDetail = ConversationSummary & {
  can_reply: boolean;
  reply_blocked_reason: string | null;
};

export type MessagePage = {
  /** Oldest first. */
  messages: ChatMessage[];
  /** Older messages exist (ask with before = messages[0].id). */
  has_more: boolean;
};

export type SendMessageResult = {
  conversation: ConversationSummary;
  message: ChatMessage;
};

export type StartConversationPayload = {
  recipient_role: ChatRole;
  recipient_user_id: string | null;
  body: string;
};

export const MAX_MESSAGE_LENGTH = 5000;

export const roleLabels: Record<ChatRole, string> = {
  SCHOOL: "School office",
  TEACHER: "Teacher",
  PARENT: "Parent",
  STUDENT: "Student",
};

export const rolePluralLabels: Record<ChatRole, string> = {
  SCHOOL: "School office",
  TEACHER: "Teachers",
  PARENT: "Parents",
  STUDENT: "Students",
};
