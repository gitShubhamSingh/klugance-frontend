"use client";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import {
  queryClient,
} from "@/core/query/query-client";

import {
  appConfig,
} from "@/core/config";

type Props = {
  children: React.ReactNode;
};

export function QueryProvider({
  children,
}: Props) {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      {children}

      {appConfig.enableReactQueryDevtools && (
        <ReactQueryDevtools
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}