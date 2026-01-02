"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Loan, LoanStatus } from "@/features/loans/types/loan"
import { useReturnLoan, useReportLostLoan, useReportDamagedLoan } from "@/features/loans/api/loanQueries"
import { useToast } from "@/features/common/hooks/use-toast"

interface LoansTableActionsProps {
  loan: Loan
}

export function LoansTableActions({ loan }: LoansTableActionsProps) {
  const { toast } = useToast()
  const [isReportDamagedOpen, setIsReportDamagedOpen] = useState(false)
  const [damageAmount, setDamageAmount] = useState("")
  const [damageDescription, setDamageDescription] = useState("")

  const returnLoanMutation = useReturnLoan()
  const reportLostMutation = useReportLostLoan()
  const reportDamagedMutation = useReportDamagedLoan()

  const handleReturn = () => {
    returnLoanMutation.mutate(loan.id, {
      onSuccess: () => toast({ title: "Loan returned", description: "Book has been marked as returned." }),
      onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
    })
  }

  const handleLost = () => {
    reportLostMutation.mutate(loan.id, {
      onSuccess: () => toast({ title: "Reported lost", description: "Book has been marked as lost." }),
      onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
    })
  }

  const handleReportDamaged = () => {
    if (!damageAmount || !damageDescription) {
      toast({ title: "Validation Error", description: "Please provide both amount and description.", variant: "destructive" })
      return
    }

    reportDamagedMutation.mutate({
      id: loan.id,
      data: {
        damageAmount: Number(damageAmount),
        damageDescription
      }
    }, {
      onSuccess: () => {
        toast({ title: "Reported damaged", description: "Book has been marked as returned with damage." })
        setIsReportDamagedOpen(false)
        setDamageAmount("")
        setDamageDescription("")
      },
      onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
    })
  }

  return (
    <>
      <Dialog open={isReportDamagedOpen} onOpenChange={setIsReportDamagedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Damaged Book</DialogTitle>
            <DialogDescription>
              Please specify the damage details and amount to charge the user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Damage Amount ($)</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={damageAmount} onChange={(e) => setDamageAmount(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={damageDescription} onChange={(e) => setDamageDescription(e.target.value)} placeholder="Torn pages, water damage, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDamagedOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReportDamaged} disabled={reportDamagedMutation.isPending}>
              {reportDamagedMutation.isPending ? "Reporting..." : "Report Damage"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(loan.status === LoanStatus.ACTIVE || loan.status === LoanStatus.OVERDUE) && (
              <>
                  <DropdownMenuItem onClick={handleReturn}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Return Book
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLost}>
                      <XCircle className="mr-2 h-4 w-4 text-destructive" /> Report Lost
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsReportDamagedOpen(true); }}>
                      <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" /> Report Damaged
                  </DropdownMenuItem>
              </>
          )}
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
