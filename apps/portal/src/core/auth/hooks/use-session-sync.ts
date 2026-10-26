"use client";

import { useEffect } from "react";

import { sessionService } from "../session/session.service";
import { accessToken } from "../utils";

/**
 * Keeps every open tab in sync with the real session:
 * - logout in one tab → all tabs sign out (guards redirect to /login)
 * - login in one tab  → other tabs pick it up (login page redirects away)
 * - page restored from the back/forward cache → reload so the guards re-run
 */
export function useSessionSync() {
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      // `key === null` means localStorage.clear() was called.
      if (event.key !== null && event.key !== accessToken.key) return;

      if (event.key === null || !event.newValue) {
        sessionService.clear();
      } else {
        void sessionService.restore();
      }
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        window.location.reload();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);
}
