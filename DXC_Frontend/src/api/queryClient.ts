import { QueryClient } from '@tanstack/react-query'

/**
 * Singleton QueryClient instance for the entire application
 * This ensures:
 * 1. Single cache instance across all components
 * 2. AuthProvider can access and clear cache on logout
 * 3. Consistent query configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 5 * 60, // 5 minutes (formerly cacheTime)
    },
  },
})
