import { QueryClient, MutationCache, QueryCache } from "@tanstack/react-query"
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

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        handleGlobalError(error as Error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        handleGlobalError(error as Error)
      },
    }),
  })
}
