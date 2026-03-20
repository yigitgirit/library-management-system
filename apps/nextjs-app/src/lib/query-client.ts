import { QueryClient, MutationCache, QueryCache, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query"
import { AppError } from "@/types/api"
import { toast } from "@/features/common/hooks/use-toast"

function handleGlobalError(error: Error) {
  if (error instanceof AppError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    })
  } else {
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred",
    })
    console.error("Global error handler caught:", error)
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,

        retry: 1,

        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },

    queryCache: !isServer ? new QueryCache({
      onError: (error) => handleGlobalError(error as Error),
    }) : undefined,

    mutationCache: !isServer ? new MutationCache({
      onError: (error) => handleGlobalError(error as Error),
    }) : undefined,
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
