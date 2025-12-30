"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fineManagementService } from "@/features/fines/services/management-service"
import { FineStatus } from "@/features/fines/types/management-types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
import { Badge } from "@/features/common/components/ui/badge"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { format, parseISO } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select"

export function FinesManagementView() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("createdAt,desc")
  const [searchEmail, setSearchEmail] = useState("")
  const [statusFilter, setStatusFilter] = useState<FineStatus | "ALL">("ALL")
  
  // Fetch Fines
  const { data: finesData, isLoading } = useQuery({
    queryKey: ['fines-management', page, sort, searchEmail, statusFilter],
    queryFn: () => fineManagementService.getAllFines({ 
        page, 
        size: 10, 
        sort,
        userEmail: searchEmail || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter
    })
  })

  const fines = finesData?.content || []
  const totalPages = finesData?.page?.totalPages || 0

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
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(0); }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value={FineStatus.UNPAID}>Unpaid</SelectItem>
                    <SelectItem value={FineStatus.PAID}>Paid</SelectItem>
                    <SelectItem value={FineStatus.WAIVED}>Waived</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : fines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No fines found.
                </TableCell>
              </TableRow>
            ) : (
              fines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{fine.userEmail}</span>
                        <span className="text-xs text-muted-foreground">ID: {fine.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-destructive">
                    ${fine.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{fine.reason}</TableCell>
                  <TableCell>
                    <Badge variant={
                        fine.status === FineStatus.PAID ? "secondary" :
                        fine.status === FineStatus.WAIVED ? "outline" :
                        "destructive"
                    }>
                        {fine.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span>{format(parseISO(fine.fineDate), "MMM d, yyyy")}</span>
                        {fine.paymentDate && (
                            <span className="text-xs text-muted-foreground">Paid: {format(parseISO(fine.paymentDate), "MMM d")}</span>
                        )}
                    </div>
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
