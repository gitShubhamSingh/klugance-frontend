"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  getContacts,
  getConversation,
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage,
  startConversation,
  type ChatApp,
} from "../api/chat";
import type { ChatContact, ConversationList, MessagePage, SendMessageResult } from "../types/chat";

export const chatKeys = {
  all: (app: ChatApp) => ["chat", app] as const,
  conversations: (app: ChatApp) => [...chatKeys.all(app), "conversations"] as const,
  conversation: (app: ChatApp, id: string) => [...chatKeys.all(app), "conversation", id] as const,
  messages: (app: ChatApp, id: string) => [...chatKeys.all(app), "messages", id] as const,
  contacts: (app: ChatApp, q: string) => [...chatKeys.all(app), "contacts", q] as const,
};

// No push channel yet: poll while the page is open (paused in background tabs).
const LIST_POLL_MS = 10_000;
const CHAT_POLL_MS = 4_000;

export function useConversations(app: ChatApp, options: { poll?: boolean } = {}) {
  return useQuery({
    queryKey: chatKeys.conversations(app),
    queryFn: () => getConversations(app),
    refetchInterval: options.poll === false ? false : LIST_POLL_MS,
  });
}

export function useConversation(app: ChatApp, id: string | null) {
  return useQuery({
    queryKey: chatKeys.conversation(app, id ?? ""),
    queryFn: () => getConversation(app, id!),
    enabled: Boolean(id),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** Newest page first; fetchNextPage loads older messages. */
export function useMessages(app: ChatApp, id: string | null) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(app, id ?? ""),
    queryFn: ({ pageParam }) => getMessages(app, id!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => (page.has_more ? page.messages[0]?.id : undefined),
    enabled: Boolean(id),
    refetchInterval: CHAT_POLL_MS,
  });
}

export function useContacts(app: ChatApp, q: string, enabled = true) {
  return useQuery({
    queryKey: chatKeys.contacts(app, q),
    queryFn: () => getContacts(app, { q }),
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

type SendInput = {
  body: string;
  /** Existing chat; otherwise the first message to `contact` starts one. */
  conversationId: string | null;
  contact: Pick<ChatContact, "role" | "user_id"> | null;
};

export function useSendMessage(app: ChatApp) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, conversationId, contact }: SendInput): Promise<SendMessageResult> =>
      conversationId
        ? sendMessage(app, conversationId, body)
        : startConversation(app, {
            recipient_role: contact!.role,
            recipient_user_id: contact!.user_id,
            body,
          }),
    retry: false,
    onSuccess: async ({ conversation, message }, { conversationId }) => {
      // Show the sent message right away in the open chat...
      queryClient.setQueryData<InfiniteData<MessagePage>>(chatKeys.messages(app, conversation.id), (old) => {
        // A brand-new chat has nothing cached yet: seed it (the next poll
        // brings the full history if the chat already existed).
        if (!old?.pages.length) {
          return conversationId ? old : { pages: [{ messages: [message], has_more: false }], pageParams: [undefined] };
        }
        const [newest, ...older] = old.pages;
        if (newest!.messages.some((m) => m.id === message.id)) return old;
        return { ...old, pages: [{ ...newest!, messages: [...newest!.messages, message] }, ...older] };
      });

      // ...and move the chat to the top of the list.
      queryClient.setQueryData<ConversationList>(chatKeys.conversations(app), (old) =>
        old
          ? {
              ...old,
              conversations: [conversation, ...old.conversations.filter((c) => c.id !== conversation.id)],
            }
          : old,
      );

      await queryClient.invalidateQueries({ queryKey: chatKeys.conversations(app) });
      // A first message creates the chat: contacts now point at it.
      if (!conversationId) await queryClient.invalidateQueries({ queryKey: [...chatKeys.all(app), "contacts"] });
    },
  });
}

export function useMarkRead(app: ChatApp) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markConversationRead(app, id),
    retry: false,
    onSuccess: async (_data, id) => {
      queryClient.setQueryData<ConversationList>(chatKeys.conversations(app), (old) => {
        if (!old) return old;
        const conversations = old.conversations.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c));
        return { conversations, total_unread: conversations.reduce((sum, c) => sum + c.unread_count, 0) };
      });
      await queryClient.invalidateQueries({ queryKey: chatKeys.conversations(app) });
    },
  });
}
