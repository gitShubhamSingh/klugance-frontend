
import { env } from "@/core/env";

export const appConfig = {
  appName: env.APP_NAME,
  apiBaseUrl: env.API_BASE_URL,

  isDevelopment:
    env.APP_ENV === "development",

  enableReactQueryDevtools:
    env.ENABLE_REACT_QUERY_DEVTOOLS,
} as const;