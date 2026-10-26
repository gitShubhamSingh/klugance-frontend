import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  ChatContact,
  ChatRole,
  ConversationDetail,
  ConversationList,
  MessagePage,
  SendMessageResult,
  StartConversationPayload,
} from "../types/chat";

/* The server resolves who is chatting from the session and only returns
   that user's own chats. Each portal role has its own copy of the API. */

export type ChatApp = "teacher" | "parent" | "student";

export const MESSAGE_PAGE_SIZE = 50;

export async function getContacts(
  app: ChatApp,
  params: { role?: ChatRole; q?: string } = {},
): Promise<ChatContact[]> {
  const { data } = await apiClient.get<ApiResponse<ChatContact[]>>(API_ENDPOINTS.MESSAGES(app).CONTACTS, {
    params: { role: params.role, q: params.q || undefined, limit: 100 },
  });
  return data.data;
}

export async function getConversations(app: ChatApp): Promise<ConversationList> {
  const { data } = await apiClient.get<ApiResponse<ConversationList>>(API_ENDPOINTS.MESSAGES(app).CONVERSATIONS);
  return data.data;
}

export async function getConversation(app: ChatApp, id: string): Promise<ConversationDetail> {
  const { data } = await apiClient.get<ApiResponse<ConversationDetail>>(API_ENDPOINTS.MESSAGES(app).CONVERSATION(id));
  return data.data;
}

export async function getMessages(app: ChatApp, id: string, before?: string): Promise<MessagePage> {
  const { data } = await apiClient.get<ApiResponse<MessagePage>>(API_ENDPOINTS.MESSAGES(app).MESSAGES(id), {
    params: { before, limit: MESSAGE_PAGE_SIZE },
  });
  return data.data;
}

export async function startConversation(app: ChatApp, payload: StartConversationPayload): Promise<SendMessageResult> {
  const { data } = await apiClient.post<ApiResponse<SendMessageResult>>(
    API_ENDPOINTS.MESSAGES(app).CONVERSATIONS,
    payload,
  );
  return data.data;
}

export async function sendMessage(app: ChatApp, id: string, body: string): Promise<SendMessageResult> {
  const { data } = await apiClient.post<ApiResponse<SendMessageResult>>(API_ENDPOINTS.MESSAGES(app).MESSAGES(id), {
    body,
  });
  return data.data;
}

export async function markConversationRead(app: ChatApp, id: string): Promise<void> {
  await apiClient.put(API_ENDPOINTS.MESSAGES(app).READ(id));
}
