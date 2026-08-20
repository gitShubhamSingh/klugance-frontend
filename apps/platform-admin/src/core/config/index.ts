import { env } from "@/core/env";

export const appConfig = {
  appName: "Klugance Platform Admin",
  apiBaseUrl: env.API_BASE_URL,
  isDevelopment: process.env.NODE_ENV === "development",
  enableReactQueryDevtools: process.env.NODE_ENV === "development",
} as const;