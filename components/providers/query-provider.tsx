"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Aggressive caching for admin performance
            staleTime: 2 * 60 * 1000,        // 2 minutes considered fresh
            gcTime: 10 * 60 * 1000,          // 10 minutes in memory cache
            retry: 1,                         // Single retry on failure
            refetchOnWindowFocus: false,      // Don't refetch on tab focus
            refetchOnMount: false,            // Use cache if available
            refetchOnReconnect: true,         // Refetch when back online
            // Enable background refetching for better UX
            refetchInterval: false,           // Disabled by default, enable per query
          },
          mutations: {
            retry: 0,
            // Global mutation settings
            onError: (error) => {
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

