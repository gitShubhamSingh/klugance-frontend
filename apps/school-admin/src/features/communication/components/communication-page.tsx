"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import { getContacts, type ChatApp } from "../api/chat";
import { chatKeys, useConversations, useMarkRead } from "../hooks/use-chat";
import { contactKey, parseContactKey } from "../lib/chat-utils";
import type { ChatContact, ConversationSummary } from "../types/chat";
import { ChatWindow } from "./chat-window";
import { ContactPicker } from "./contact-picker";
import { ConversationList } from "./conversation-list";

const listSubtitles: Record<ChatApp, string> = {
  school: "School office inbox · shared by all school admins",
};

/**
 * WhatsApp-style messaging for the school office: chat list on the left,
 * the open chat on the right (one at a time on phones). Supports deep
 * links like ?to=TEACHER:<user id>.
 */
export function CommunicationPage({ app }: { app: ChatApp }) {
  const queryClient = useQueryClient();
  const listQuery = useConversations(app);
  const { mutate: markRead } = useMarkRead(app);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftContact, setDraftContact] = useState<ChatContact | null>(null);
  const [panel, setPanel] = useState<"chats" | "new">("chats");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const conversations = listQuery.data?.conversations ?? [];
  const summary = conversations.find((c) => c.id === selectedId) ?? null;

  function openConversation(conversation: ConversationSummary) {
    setSelectedId(conversation.id);
    setDraftContact(null);
    setPanel("chats");
    setMobileView("chat");
  }

  function openContact(contact: ChatContact) {
    setSelectedId(contact.conversation_id);
    setDraftContact(contact);
    setPanel("chats");
    setMobileView("chat");
  }

  function backToList() {
    // Leaving the chat on a phone: stop marking its new messages read.
    setSelectedId(null);
    setDraftContact(null);
    setMobileView("list");
  }

  // Opening a chat (or a new message arriving in it) marks it read,
  // once per latest message so a failed call is not retried in a loop.
  const readKey = summary && summary.unread_count > 0 ? `${summary.id}:${summary.last_message_at}` : null;
  const markedKey = useRef<string | null>(null);
  useEffect(() => {
    if (!readKey || !selectedId || markedKey.current === readKey) return;
    markedKey.current = readKey;
    markRead(selectedId);
  }, [readKey, selectedId, markRead]);

  // ?to=<role>:<user id> opens (or starts) the chat with that contact.
  const deepLinkHandled = useRef(false);
  useEffect(() => {
    if (deepLinkHandled.current) return;
    deepLinkHandled.current = true;

    const target = parseContactKey(new URLSearchParams(window.location.search).get("to"));
    if (!target) return;
    window.history.replaceState(null, "", window.location.pathname);

    queryClient
      .fetchQuery({
        queryKey: [...chatKeys.all(app), "contacts-for", target.role],
        queryFn: () => getContacts(app, { role: target.role }),
      })
      .then((contacts) => {
        const match = contacts.find((c) => contactKey(c) === contactKey({ role: target.role, user_id: target.userId }));
        if (!match) {
          toast.error("You can't message this person from here.");
          return;
        }
        setSelectedId(match.conversation_id);
        setDraftContact(match);
        setMobileView("chat");
      })
      .catch((error) => toast.error(getErrorMessage(error)));
  }, [app, queryClient]);

  const paneKey = summary
    ? contactKey(summary.counterpart)
    : draftContact
      ? contactKey(draftContact)
      : (selectedId ?? "empty");

  return (
    <div className="p-4 sm:p-6">
      <div className="grid h-[calc(100svh-6rem)] min-h-[520px] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-2xl border bg-card sm:h-[calc(100svh-7rem)] lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
        {panel === "new" ? (
          <ContactPicker
            app={app}
            onBack={() => setPanel("chats")}
            onPick={openContact}
            className={cn("lg:flex lg:border-r", mobileView === "chat" && "hidden")}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            totalUnread={listQuery.data?.total_unread ?? 0}
            isLoading={listQuery.isLoading}
            error={listQuery.isError && !listQuery.data ? getErrorMessage(listQuery.error) : null}
            selectedId={selectedId}
            subtitle={listSubtitles[app]}
            onSelect={openConversation}
            onNewChat={() => setPanel("new")}
            onRetry={() => void listQuery.refetch()}
            className={cn("lg:flex lg:border-r", mobileView === "chat" && "hidden")}
          />
        )}

        <ChatWindow
          key={paneKey}
          app={app}
          conversationId={selectedId}
          draftContact={draftContact}
          summary={summary}
          onBack={backToList}
          onStarted={setSelectedId}
          onNewChat={() => {
            setPanel("new");
            setMobileView("list");
          }}
          className={cn("lg:flex", mobileView === "list" && "hidden")}
        />
      </div>
    </div>
  );
}
