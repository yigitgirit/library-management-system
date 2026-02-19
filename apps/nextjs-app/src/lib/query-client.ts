import { QueryClient, MutationCache, QueryCache, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query"
import { AppError } from "@/types/api"
import { toast } from "@/features/common/hooks/use-toast"

/**
 * GLOBAL ERROR HANDLER
 *
 * This function is automatically triggered when an error occurs during any query (Query) or
 * mutation (Mutation) executed via React Query.
 *
 * Purpose: To report errors to the user from a central location instead of writing separate try-catch blocks or
 * onError callbacks in every component.
 *
 * @param error - The caught error object
 */
function handleGlobalError(error: Error) {
  // If the error is an expected API error defined by us (e.g., Validation error, 404, 403)
  if (error instanceof AppError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    })
  } else {
    // Unexpected system errors (e.g., Network failure, 500 Server Error, JSON parse error)
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred",
    })
    // Detailed logs are printed to the console for debugging during development.
    console.error("Global error handler caught:", error)
  }
}

/**
 * QUERY CLIENT FACTORY
 *
 * This function creates a new QueryClient instance with predefined settings
 * every time it is called.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: The duration (in milliseconds) for which the data is considered "fresh".
        // Example: For 60 seconds, no new request is made for the same data; it is served from the cache.
        staleTime: 60 * 1000,

        // retry: The number of times to retry if the request fails.
        // Example: If the server doesn't respond momentarily, it tries 1 more time before throwing an error.
        retry: 1,

        // refetchOnWindowFocus: Whether to automatically refetch data when the user returns from another tab.
        // Set to false to prevent unnecessary traffic.
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Critical setting for Next.js Streaming and SSR (Server Side Rendering).
        // Normally, only "success" data is transferred (hydrated) from server to client.
        // However, when using Next.js streaming, pending requests on the server must also be
        // transferred to the client to continue there.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },

    // GLOBAL CACHE SETTINGS
    // Note: Global error handling (Toast display) should only be active on the Client (Browser) side.
    // Since "window" or "document" objects do not exist on the Server side, Toast would cause an error.

    // QueryCache: Global settings for data fetching (GET) operations
    queryCache: !isServer ? new QueryCache({
      onError: (error) => handleGlobalError(error as Error),
    }) : undefined,

    // MutationCache: Global settings for data modification (POST, PUT, DELETE) operations
    mutationCache: !isServer ? new MutationCache({
      onError: (error) => handleGlobalError(error as Error),
    }) : undefined,
  })
}

// Variable to hold the QueryClient instance on the browser side (for Singleton pattern)
let browserQueryClient: QueryClient | undefined = undefined

/**
 * QUERY CLIENT ACCESS FUNCTION (GETTER)
 *
 * Due to Next.js's execution logic (SSR + CSR), we need to provide the QueryClient
 * differently depending on the environment.
 *
 * @returns QueryClient instance
 */
export function getQueryClient() {
  if (isServer) {
    // SERVER SIDE:
    // On the server, every HTTP request must be isolated.
    // If we use a single client, User A's data might mix with User B's request (Security/Privacy Leak).
    // Therefore, a new instance is ALWAYS created on the server.
    return makeQueryClient()
  } else {
    // CLIENT SIDE (BROWSER):
    // There is only one user in the browser, and the application state must be preserved.
    // The Singleton pattern is used to prevent cache deletion during page transitions.
    // If the client hasn't been created before, create it; otherwise, return the existing one.
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
