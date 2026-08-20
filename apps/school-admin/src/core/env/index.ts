export const env = {
    APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME ??
      "Klugance School Admin",
  
    APP_ENV:
      process.env.NEXT_PUBLIC_APP_ENV ??
      "development",
  
    API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://127.0.0.1:8000/api/v1",
  
    ENABLE_REACT_QUERY_DEVTOOLS:
      process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEVTOOLS ===
      "true",
  } as const;