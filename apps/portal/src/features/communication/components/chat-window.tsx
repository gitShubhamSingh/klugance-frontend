"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  Loader2,
  Lock,
  MessageSquarePlus,
  MessagesSquare,
  RotateCcw,
  SendHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import type { ChatApp } from "../api/chat";
import { useConversation, useMessages, useSendMessage } from "../hooks/use-chat";
import { dayLabel, groupByDay, timeLabel } from "../lib/chat-utils";
import {
  MAX_MESSAGE_LENGTH,
  roleLabels,
  type ChatContact,
  type ChatMessage,
  type ChatPerson,
  type ConversationSummary,
} from "../types/chat";
import { ChatAvatar } from "./chat-avatar";
import { MessageStatus, type BubbleStatus } from "./message-status";

type Props = {
  app: ChatApp;
  conversationId: string | null;
  /** A contact picked from "New chat" that has no chat yet. */
  draftContact: ChatContact | null;
  /** From the chat list, so the header shows before the detail loads. */
  summary: ConversationSummary | null;
  onBack: () => void;
  /** The first message to a draft contact created the chat. */
  onStarted: (conversationId: string) => void;
  onNewChat: () => void;
  className?: string;
};

export function ChatWindow({ summary, draftContact, onNewChat, className, ...props }: Props) {
  const person = summary?.counterpart ?? draftContact;

  if (!person && !props.conversationId) {
    return (
      <section className={cn("flex flex-col items-center justify-center bg-muted/20 p-8 text-center", className)}>
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <MessagesSquare className="size-7 text-emerald-600 dark:text-emerald-400" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Your messages</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Pick a chat on the left, or start a new one. Every message is kept, so you can scroll back through the whole
          history any time.
        </p>
        <Button type="button" className="mt-5" onClick={onNewChat}>
          <MessageSquarePlus />
          New chat
        </Button>
      </section>
    );
  }

  return <ChatPane {...props} summary={summary} draftContact={draftContact} className={className} />;
}

type Pending = {
  tempId: string;
  body: string;
  created_at: string;
  error: string | null;
};

type Item =
  | { kind: "message"; id: string; created_at: string; message: ChatMessage }
  | { kind: "pending"; id: string; created_at: string; pending: Pending };

function ChatPane({
  app,
  conversationId,
  draftContact,
  summary,
  onBack,
  onStarted,
  className,
}: Omit<Props, "onNewChat">) {
  const detailQuery = useConversation(app, conversationId);
  const messagesQuery = useMessages(app, conversationId);
  const sendMutation = useSendMessage(app);
  const [pending, setPending] = useState<Pending[]>([]);

  const detail = detailQuery.data;
  const person: ChatPerson | null = detail?.counterpart ?? summary?.counterpart ?? draftContact;
  const canReply = detail ? detail.can_reply : true;

  // Pages come newest first; show oldest first, without duplicates.
  const pages = messagesQuery.data?.pages;
  const messages = useMemo(() => {
    const seen = new Set<string>();
    return [...(pages ?? [])]
      .reverse()
      .flatMap((p) => p.messages)
      .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
  }, [pages]);

  const items: Item[] = [
    ...messages.map((m) => ({ kind: "message" as const, id: m.id, created_at: m.created_at, message: m })),
    ...pending.map((p) => ({ kind: "pending" as const, id: p.tempId, created_at: p.created_at, pending: p })),
  ];

  // ---------------------------------------------------------------- scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const lastItemId = useRef<string | null>(null);
  const restoreFrom = useRef<{ height: number; pages: number } | null>(null);
  const [showJump, setShowJump] = useState(false);

  const last = items[items.length - 1];
  const pageCount = pages?.length ?? 0;

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Older messages were prepended: keep the same message in view.
    if (restoreFrom.current && pageCount > restoreFrom.current.pages) {
      el.scrollTop += el.scrollHeight - restoreFrom.current.height;
      restoreFrom.current = null;
      return;
    }

    if (!last || last.id === lastItemId.current) return;
    const first = lastItemId.current === null;
    lastItemId.current = last.id;

    const mine = last.kind === "pending" || last.message.from_me;
    if (first || mine || atBottom.current) {
      el.scrollTop = el.scrollHeight;
      setShowJump(false);
    } else {
      setShowJump(true);
    }
  }, [last, pageCount]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom.current) setShowJump(false);
  }

  function jumpToLatest() {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowJump(false);
  }

  function loadOlder() {
    const el = scrollRef.current;
    if (!el || messagesQuery.isFetchingNextPage) return;
    restoreFrom.current = { height: el.scrollHeight, pages: pageCount };
    void messagesQuery.fetchNextPage();
  }

  // ---------------------------------------------------------------- send
  function submit(item: Pending) {
    sendMutation.mutate(
      {
        body: item.body,
        conversationId,
        contact: conversationId ? null : draftContact,
      },
      {
        onSuccess: (result) => {
          setPending((list) => list.filter((p) => p.tempId !== item.tempId));
          if (!conversationId) onStarted(result.conversation.id);
        },
        onError: (error) =>
          setPending((list) =>
            list.map((p) => (p.tempId === item.tempId ? { ...p, error: getErrorMessage(error) } : p)),
          ),
      },
    );
  }

  function send(body: string) {
    const item: Pending = {
      tempId: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      body,
      created_at: new Date().toISOString(),
      error: null,
    };
    setPending((list) => [...list, item]);
    submit(item);
  }

  function retry(item: Pending) {
    setPending((list) => list.map((p) => (p.tempId === item.tempId ? { ...p, error: null } : p)));
    submit({ ...item, error: null });
  }

  if (!person) {
    // An id with nothing cached yet (e.g. a deep link): wait for the detail.
    return (
      <section className={cn("flex min-h-0 flex-col", className)}>
        {detailQuery.isError ? (
          <LoadError message={getErrorMessage(detailQuery.error)} onRetry={() => void detailQuery.refetch()} />
        ) : (
          <MessagesSkeleton />
        )}
      </section>
    );
  }

  const groups = groupByDay(items);
  const loadingMessages = Boolean(conversationId) && messagesQuery.isLoading;

  return (
    <section className={cn("flex min-h-0 flex-col", className)}>
      {/* Header */}
      <header className="flex items-center gap-3 border-b bg-card px-3 py-2.5 sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onBack}
          aria-label="Back to chats"
        >
          <ArrowLeft />
        </Button>
        <ChatAvatar person={person} className="size-10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{person.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {person.role === "SCHOOL"
              ? (person.subtitle ?? "Principal & administration")
              : [roleLabels[person.role], person.subtitle]
                  .filter((part, i, parts) => part && parts.indexOf(part) === i)
                  .join(" · ")}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="h-full overflow-y-auto bg-muted/30 px-3 py-4 sm:px-6"
          role="log"
          aria-live="polite"
          aria-label={`Chat with ${person.name}`}
        >
          {loadingMessages ? (
            <MessagesSkeleton />
          ) : messagesQuery.isError && messages.length === 0 ? (
            <LoadError message={getErrorMessage(messagesQuery.error)} onRetry={() => void messagesQuery.refetch()} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-1">
              {messagesQuery.hasNextPage ? (
                <div className="flex justify-center pb-3">
                  <Button type="button" variant="outline" size="sm" onClick={loadOlder} disabled={messagesQuery.isFetchingNextPage}>
                    {messagesQuery.isFetchingNextPage && <Loader2 className="animate-spin" />}
                    Load earlier messages
                  </Button>
                </div>
              ) : (
                <p className="mx-auto mb-3 w-fit max-w-sm rounded-lg bg-amber-500/10 px-3 py-1.5 text-center text-[11px] text-amber-900 dark:text-amber-200">
                  {items.length === 0
                    ? `Say hello to ${person.name}. `
                    : `Chat started ${startedPhrase(detail?.created_at ?? summary?.created_at ?? items[0]!.created_at)}. `}
                  Messages are kept as part of your school&apos;s records.
                </p>
              )}

              {groups.map((group) => (
                <div key={group.day} className="space-y-1">
                  <div className="sticky top-0 z-10 flex justify-center py-2">
                    <span className="rounded-lg bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                      {group.day}
                    </span>
                  </div>

                  {group.items.map((item, index) => {
                    const previous = group.items[index - 1];
                    return (
                      <ItemBubble
                        key={item.id}
                        item={item}
                        person={person}
                        startsRun={!previous || runKey(previous) !== runKey(item)}
                        onRetry={retry}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {showJump && (
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={jumpToLatest}
            className="absolute right-4 bottom-4 rounded-full shadow-md"
            aria-label="Jump to latest message"
          >
            <ArrowDown />
          </Button>
        )}
      </div>

      {/* Composer */}
      {canReply ? (
        <Composer placeholder={`Message ${person.name}`} onSend={send} />
      ) : (
        <div className="flex items-center justify-center gap-2 border-t bg-card px-4 py-4 text-center text-sm text-muted-foreground">
          <Lock className="size-4 shrink-0" />
          {detail?.reply_blocked_reason ?? "You can't reply in this chat."}
        </div>
      )}
    </section>
  );
}

/** "today", "yesterday", "on Monday", "on 19 Oct". */
function startedPhrase(iso: string) {
  const day = dayLabel(iso);
  return day === "Today" || day === "Yesterday" ? day.toLowerCase() : `on ${day}`;
}

/** Consecutive bubbles from the same author share one "tail". */
function runKey(item: Item) {
  if (item.kind === "pending") return "me";
  return `${item.message.from_me ? "me" : "them"}:${item.message.sender.user_id}`;
}

function ItemBubble({
  item,
  person,
  startsRun,
  onRetry,
}: {
  item: Item;
  person: ChatPerson;
  startsRun: boolean;
  onRetry: (pending: Pending) => void;
}) {
  if (item.kind === "pending") {
    const { pending } = item;
    return (
      <Bubble
        mine
        body={pending.body}
        time={timeLabel(pending.created_at)}
        status={pending.error ? "FAILED" : "PENDING"}
        startsRun={startsRun}
        footer={
          pending.error && (
            <button
              type="button"
              onClick={() => onRetry(pending)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-destructive hover:underline"
            >
              <RotateCcw className="size-3" />
              Not sent: {pending.error}. Tap to retry
            </button>
          )
        }
      />
    );
  }

  const { message } = item;

  // Name the author when the chat has several people on one side:
  // school admins share the office inbox.
  let author: string | null = null;
  if (startsRun && !message.from_me && person.role === "SCHOOL") {
    author = message.sender.title ? `${message.sender.name} · ${message.sender.title}` : message.sender.name;
  } else if (startsRun && message.from_me && !message.sent_by_me) {
    author = message.sender.name;
  }

  return (
    <Bubble
      mine={message.from_me}
      author={author}
      body={message.body}
      time={timeLabel(message.created_at)}
      status={message.from_me ? message.status : null}
      startsRun={startsRun}
    />
  );
}

function Bubble({
  mine,
  author,
  body,
  time,
  status,
  startsRun,
  footer,
}: {
  mine: boolean;
  author?: string | null;
  body: string;
  time: string;
  status: BubbleStatus | null;
  startsRun: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start", startsRun && "pt-1.5")}>
      <div
        className={cn(
          "relative max-w-[85%] rounded-xl px-2.5 pt-1.5 pb-1 text-sm shadow-sm sm:max-w-[70%]",
          mine
            ? "bg-emerald-100 text-emerald-950 dark:bg-emerald-900/70 dark:text-emerald-50"
            : "bg-card text-card-foreground",
          startsRun && (mine ? "rounded-tr-sm" : "rounded-tl-sm"),
        )}
      >
        {author && <p className="mb-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{author}</p>}
        <p className="leading-relaxed break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
          {body}
          {/* Room for the time + ticks, like WhatsApp. */}
          <span aria-hidden className={cn("inline-block", mine ? "w-20" : "w-14")} />
        </p>
        <span
          className={cn(
            "absolute right-2 bottom-1 flex items-center gap-1 text-[10px] tabular-nums",
            mine ? "text-emerald-900/60 dark:text-emerald-100/60" : "text-muted-foreground",
          )}
        >
          {time}
          {status && (
            <MessageStatus status={status} className={status === "READ" || status === "FAILED" ? undefined : "text-current"} />
          )}
        </span>
        {footer}
      </div>
    </div>
  );
}

function Composer({ placeholder, onSend }: { placeholder: string; onSend: (body: string) => void }) {
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Grow with the text, up to ~6 lines, then scroll.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const full = el.scrollHeight + el.offsetHeight - el.clientHeight;
    el.style.height = `${Math.min(full, 160)}px`;
    el.style.overflowY = full > 160 ? "auto" : "hidden";
  }, [draft]);

  const body = draft.trim();
  const tooLong = draft.length > MAX_MESSAGE_LENGTH;

  function submit() {
    if (!body || tooLong) return;
    onSend(body);
    setDraft("");
    ref.current?.focus();
  }

  return (
    <div className="border-t bg-card px-3 py-2.5 sm:px-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={placeholder}
          aria-label="Type a message"
          className="max-h-40 min-h-10 resize-none rounded-2xl bg-background py-2.5"
        />
        <Button
          type="button"
          size="icon"
          onClick={submit}
          disabled={!body || tooLong}
          aria-label="Send message"
          className="size-10 shrink-0 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <SendHorizontal />
        </Button>
      </div>
      <p className="mx-auto mt-1 flex max-w-3xl justify-between px-1 text-[11px] text-muted-foreground">
        <span className="hidden sm:inline">Enter to send · Shift + Enter for a new line</span>
        {draft.length > MAX_MESSAGE_LENGTH - 300 && (
          <span className={cn("ml-auto tabular-nums", tooLong && "font-medium text-destructive")}>
            {draft.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </p>
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-3 p-4" role="status" aria-label="Loading messages">
      <Skeleton className="h-12 w-2/3 rounded-xl" />
      <Skeleton className="ml-auto h-10 w-1/2 rounded-xl" />
      <Skeleton className="h-16 w-3/5 rounded-xl" />
    </div>
  );
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
