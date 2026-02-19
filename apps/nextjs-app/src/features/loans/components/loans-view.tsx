"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Library, BookOpenText, History } from "lucide-react"
import Link from "next/link"
import { LoanStatus } from "../types/loan"
import { ActiveLoanCard } from "./active-loan-card"
import { HistoryLoanItem } from "./history-loan-item"
import { useQuery } from "@tanstack/react-query"
import { loanQueries } from "../api/loanQueries"
import { Skeleton } from "@/components/ui/skeleton"

export function LoansView() {
  const { data: loansData, isLoading } = useQuery(loanQueries.myLoans())
  const allLoans = loansData?.content || []

  // Filter Active Loans (ACTIVE + OVERDUE)
  const activeLoans = allLoans.filter(loan =>
    loan.status === LoanStatus.ACTIVE || loan.status === LoanStatus.OVERDUE
  );
  
  // Filter History Loans (Everything else)
  const historyLoans = allLoans.filter(loan => 
    loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.OVERDUE
  );

  if (isLoading && !loansData) {
      return <LoansViewSkeleton />
  }

  return (
    <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Library</h1>
                <p className="text-muted-foreground mt-1">
                    Track your reading journey, manage active loans, and view your history.
                </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground bg-background p-3 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2">
                    <BookOpenText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{activeLoans.length}</span> Active
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{historyLoans.length}</span> Returned
                </div>
            </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                <TabsTrigger value="active">Active Loans</TabsTrigger>
                <TabsTrigger value="history">Loan History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6 space-y-6">
                {activeLoans.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {activeLoans.map((loan) => (
                            <ActiveLoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="You don't have any active loans." />
                )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
                {historyLoans.length > 0 ? (
                    <div className="rounded-md border">
                        <div className="p-4">
                            {historyLoans.map((loan) => (
                                <HistoryLoanItem key={loan.id} loan={loan} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState message="No loan history found." />
                )}
            </TabsContent>
        </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
            <Library className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold">No loans</h3>
            <p className="text-muted-foreground">{message}</p>
            <Button variant="link" asChild className="mt-2">
                <Link href="/books">Browse Catalog</Link>
            </Button>
        </div>
    )
}

function LoansViewSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-12 w-48" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-10 w-[400px]" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
}
