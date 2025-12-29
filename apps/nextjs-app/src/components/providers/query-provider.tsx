"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@/lib/api-client/query-client"
import { ReactNode, useState } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures the client is created once
  // on the browser, but fresh on the server.
  const [queryClient] = useState(() => createQueryClient())

  return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
  )
}
