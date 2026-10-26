"use client";

import { useMemo, useState } from "react";
import { AlertCircle, MessageSquarePlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { firstName, listTimeLabel } from "../lib/chat-utils";
import { rolePluralLabels, type ChatRole, type ConversationSummary } from "../types/chat";
import { ChatAvatar, RoleBadge } from "./chat-avatar";
import { MessageStatus } from "./message-status";

type Filter = "all" | "unread" | ChatRole;

type Props = {
  conversations: ConversationSummary[];
  totalUnread: number;
  isLoading: boolean;
  error: string | null;
  selectedId: string | null;
  subtitle: string;
  onSelect: (conversation: ConversationSummary) => void;
  onNewChat: () => void;
  onRetry: () => void;
  className?: string;
};

export function ConversationList({
  conversations,
  totalUnread,
  isLoading,
  error,
  selectedId,
  subtitle,
  onSelect,
  onNewChat,
  onRetry,
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Role chips only for roles that actually have chats.
  const roles = useMemo(
    () =>
      (["SCHOOL", "TEACHER", "PARENT", "STUDENT"] as ChatRole[]).filter((role) =>
        conversations.some((c) => c.counterpart.role === role),
      ),
    [conversations],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => {
      if (filter === "unread" && c.unread_count === 0) return false;
      if (filter !== "all" && filter !== "unread" && c.counterpart.role !== filter) return false;
      if (!q) return true;
      return (
        c.counterpart.name.toLowerCase().includes(q) ||
        Boolean(c.counterpart.subtitle?.toLowerCase().includes(q)) ||
        Boolean(c.last_message?.body.toLowerCase().includes(q))
      );
    });
  }, [conversations, query, filter]);

  const chips: Array<{ value: Filter; label: string }> = [
    { value: "all", label: "All" },
    { value: "unread", label: totalUnread > 0 ? `Unread (${totalUnread})` : "Unread" },
    ...(roles.length > 1 ? roles.map((role) => ({ value: role as Filter, label: rolePluralLabels[role] })) : []),
  ];

  return (
    <aside className={cn("flex min-h-0 flex-col", className)}>
      <div className="space-y-3 border-b p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">Chats</h1>
            <p className="truncate text-xs text-muted-foreground">
              {totalUnread > 0 ? `${totalUnread} unread ${totalUnread === 1 ? "message" : "messages"}` : subtitle}
            </p>
          </div>
          <Button type="button" size="sm" onClick={onNewChat}>
            <MessageSquarePlus />
            New chat
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            aria-label="Search chats"
            className="pl-8"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filter chats">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              role="tab"
              aria-selected={filter === chip.value}
              onClick={() => setFilter(chip.value)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === chip.value
                  ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-1 p-2" role="status" aria-label="Loading chats">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="size-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center p-8 text-center">
            <AlertCircle className="size-6 text-destructive" />
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium">{conversations.length === 0 ? "No chats yet" : "No matching chats"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {conversations.length === 0 ? "Start a new chat to send your first message." : "Try another name or filter."}
            </p>
            {conversations.length === 0 && (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onNewChat}>
                <MessageSquarePlus />
                New chat
              </Button>
            )}
          </div>
        ) : (
          <ul className="p-1.5">
            {visible.map((c) => (
              <li key={c.id}>
                <ConversationRow conversation={c} active={c.id === selectedId} onSelect={() => onSelect(c)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function ConversationRow({
  conversation: c,
  active,
  onSelect,
}: {
  conversation: ConversationSummary;
  active: boolean;
  onSelect: () => void;
}) {
  const last = c.last_message;
  const unread = c.unread_count > 0;

  // Who wrote the preview, when it isn't obvious (shared office inbox).
  let author: string | null = null;
  if (last?.from_me && !last.sent_by_me) author = firstName(last.sender.name);
  else if (last && !last.from_me && c.counterpart.role === "SCHOOL") author = firstName(last.sender.name);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
        active ? "bg-muted" : "hover:bg-muted/60",
      )}
    >
      <ChatAvatar person={c.counterpart} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("min-w-0 truncate text-sm", unread ? "font-semibold" : "font-medium")}>
            {c.counterpart.name}
          </p>
          <RoleBadge role={c.counterpart.role} />
          <span
            className={cn(
              "ml-auto shrink-0 text-[11px] tabular-nums",
              unread ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
            )}
          >
            {listTimeLabel(c.last_message_at)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          {last?.from_me && last.status && <MessageStatus status={last.status} />}
          <p className={cn("min-w-0 flex-1 truncate text-[13px]", unread ? "text-foreground" : "text-muted-foreground")}>
            {author && <span className="font-medium">{author}: </span>}
            {last?.body ?? c.counterpart.subtitle}
          </p>
          {unread && (
            <span
              className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-semibold text-white tabular-nums"
              aria-label={`${c.unread_count} unread`}
            >
              {c.unread_count > 99 ? "99+" : c.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
