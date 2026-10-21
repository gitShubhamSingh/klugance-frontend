
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is missing. Configure it in apps/portal/.env.local",
  );
}

export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Klugance Portal",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",

  // Keep the property name expected by core/config.
  API_BASE_URL: apiBaseUrl.replace(/\/+$/, ""),

  APP_ENV: process.env.NODE_ENV ?? "development",

  ENABLE_REACT_QUERY_DEVTOOLS:
    process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEVTOOLS === "true",
} as const;
