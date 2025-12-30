"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { loanManagementService } from "@/features/loans/services/management-service"
import { LoanStatus } from "@/features/loans/types/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
import { Badge } from "@/features/common/components/ui/badge"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { useToast } from "@/features/common/components/ui/use-toast"
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Filter
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/common/components/ui/dialog"
import { Label } from "@/features/common/components/ui/label"
import { format, parseISO } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select"

export function LoansManagementView() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("loanDate,desc")
  const [searchEmail, setSearchEmail] = useState("")
  const [searchBook, setSearchBook] = useState("")
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "ALL">("ALL")
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch Loans
  const { data: loansData, isLoading } = useQuery({
    queryKey: ['loans-management', page, sort, searchEmail, searchBook, statusFilter],
    queryFn: () => loanManagementService.getAllLoans({ 
        page, 
        size: 10, 
        sort,
        userEmail: searchEmail || undefined,
        bookTitle: searchBook || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter
    })
  })

  const loans = loansData?.content || []
  const totalPages = loansData?.page?.totalPages || 0

  // Mutations
  const returnLoanMutation = useMutation({
    mutationFn: (id: number) => loanManagementService.returnLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans-management'] })
      toast({ title: "Loan returned", description: "Book has been marked as returned." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  const reportLostMutation = useMutation({
    mutationFn: (id: number) => loanManagementService.reportLost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans-management'] })
      toast({ title: "Reported lost", description: "Book has been marked as lost." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by user email..." 
                    className="pl-9"
                    value={searchEmail}
                    onChange={(e) => { setSearchEmail(e.target.value); setPage(0); }}
                />
            </div>
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by book title..." 
                    className="pl-9"
                    value={searchBook}
                    onChange={(e) => { setSearchBook(e.target.value); setPage(0); }}
                />
            </div>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(0); }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={LoanStatus.OVERDUE}>Overdue</SelectItem>
                    <SelectItem value={LoanStatus.RETURNED}>Returned</SelectItem>
                    <SelectItem value={LoanStatus.LOST}>Lost</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Loan
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Loan Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No loans found.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{loan.userEmail}</span>
                        <span className="text-xs text-muted-foreground">ID: {loan.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium line-clamp-1" title={loan.bookTitle}>{loan.bookTitle}</span>
                        <span className="text-xs text-muted-foreground">Copy ID: {loan.copyId}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(parseISO(loan.loanDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <span className={loan.isOverdue ? "text-destructive font-medium" : ""}>
                        {format(parseISO(loan.dueDate), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                        loan.status === LoanStatus.ACTIVE ? "default" :
                        loan.status === LoanStatus.OVERDUE ? "destructive" :
                        loan.status === LoanStatus.RETURNED ? "secondary" :
                        "outline"
                    }>
                        {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                                <DropdownMenuItem onClick={() => returnLoanMutation.mutate(loan.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Return Book
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => reportLostMutation.mutate(loan.id)}>
                                    <XCircle className="mr-2 h-4 w-4 text-destructive" /> Report Lost
                                </DropdownMenuItem>
                                {/* Report Damaged would require a dialog for details */}
                            </>
                        )}
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm font-medium">
            Page {page + 1} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1 || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
