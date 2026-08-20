"use client";

import { useEffect, useState } from "react";

import { sessionService } from "../session/session.service";

export function useAuthBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await sessionService.restore();
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  return ready;
}