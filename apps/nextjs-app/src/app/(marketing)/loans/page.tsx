import { LoansView } from "@/features/loans/components/loans-view"
import { loanService } from "@/features/loans/services/loanService"
import { loanQueries } from "@/features/loans/api/loanQueries"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import {getQueryClient} from "@/lib/query-client";

export default async function LoansPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?redirect=/loans")
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: loanQueries.myLoans().queryKey,
    queryFn: () => loanService.getMyLoans(),
  })

  return (
    <div className="flex min-h-screen flex-col bg-muted/5">
      <main className="flex-1 container mx-auto max-w-5xl py-10 px-4 md:px-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LoansView />
        </HydrationBoundary>
      </main>
    </div>
  )
}
