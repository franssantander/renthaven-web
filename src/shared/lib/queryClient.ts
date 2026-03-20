import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 100 * 60 * 5,
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
});
