"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import type { ChatApp } from "../api/chat";
import { useContacts } from "../hooks/use-chat";
import { contactKey } from "../lib/chat-utils";
import { rolePluralLabels, type ChatContact, type ChatRole } from "../types/chat";
import { ChatAvatar } from "./chat-avatar";

const ROLE_ORDER: ChatRole[] = ["SCHOOL", "TEACHER", "PARENT", "STUDENT"];

function useDebounced(value: string, ms = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/** WhatsApp-style "New chat" panel: everyone this user may message. */
export function ContactPicker({
  app,
  onBack,
  onPick,
  className,
}: {
  app: ChatApp;
  onBack: () => void;
  onPick: (contact: ChatContact) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<ChatRole | "all">("all");
  const q = useDebounced(query.trim());
  const contactsQuery = useContacts(app, q);

  const contacts = useMemo(() => contactsQuery.data ?? [], [contactsQuery.data]);
  const roles = ROLE_ORDER.filter((r) => contacts.some((c) => c.role === r));
  const visible = role === "all" ? contacts : contacts.filter((c) => c.role === role);
  const groups = ROLE_ORDER.map((r) => ({ role: r, items: visible.filter((c) => c.role === r) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <aside className={cn("flex min-h-0 flex-col", className)}>
      <div className="space-y-3 border-b p-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back to chats">
            <ArrowLeft />
          </Button>
          <h2 className="text-lg font-semibold tracking-tight">New chat</h2>
          {contactsQuery.isFetching && !contactsQuery.isLoading && (
            <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" aria-label="Searching" />
          )}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            aria-label="Search contacts"
            className="pl-8"
          />
        </div>

        {roles.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filter contacts">
            {(["all", ...roles] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={role === value}
                onClick={() => setRole(value)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  role === value
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "all" ? "All" : rolePluralLabels[value]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {contactsQuery.isLoading ? (
          <div className="space-y-1 p-2" role="status" aria-label="Loading contacts">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="size-11 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : contactsQuery.isError ? (
          <div role="alert" className="flex flex-col items-center p-8 text-center">
            <AlertCircle className="size-6 text-destructive" />
            <p className="mt-2 text-sm text-muted-foreground">{getErrorMessage(contactsQuery.error)}</p>
          </div>
        ) : groups.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {q ? `No one matches "${q}".` : "There is nobody you can message yet."}
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.role} aria-label={rolePluralLabels[group.role]}>
              <h3 className="px-4 pt-4 pb-1 text-xs font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                {rolePluralLabels[group.role]}
              </h3>
              <ul className="px-1.5 pb-1">
                {group.items.map((contact) => (
                  <li key={contactKey(contact)}>
                    <button
                      type="button"
                      onClick={() => onPick(contact)}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                    >
                      <ChatAvatar person={contact} className="size-10" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{contact.name}</p>
                        {contact.subtitle && (
                          <p className="truncate text-xs text-muted-foreground">{contact.subtitle}</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
