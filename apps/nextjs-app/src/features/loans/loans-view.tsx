"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Library } from "lucide-react"
import { LoanUserSummaryDto } from "@/lib/api"
import Link from "next/link"
import { ActiveLoanCard } from "./active-loan-card"
import { HistoryLoanItem } from "./history-loan-item"

interface LoansViewProps {
  activeLoans: LoanUserSummaryDto[]
  historyLoans: LoanUserSummaryDto[]
}

export function LoansView({ activeLoans, historyLoans }: LoansViewProps) {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
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
