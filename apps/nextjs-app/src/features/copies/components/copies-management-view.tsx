"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { copyManagementService } from "@/features/copies/services/management-service"
import { CopyStatus } from "@/features/copies/types/management-types"
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
import { useToast } from "@/features/common/components/ui/use-toast"
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Archive,
  Edit
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select"

export function CopiesManagementView() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("id,asc")
  const [searchBarcode, setSearchBarcode] = useState("")
  const [statusFilter, setStatusFilter] = useState<CopyStatus | "ALL">("ALL")
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch Copies
  const { data: copiesData, isLoading } = useQuery({
    queryKey: ['copies-management', page, sort, searchBarcode, statusFilter],
    queryFn: () => copyManagementService.getAllCopies({ 
        page, 
        size: 10, 
        sort,
        barcode: searchBarcode || undefined,
        copyStatus: statusFilter === "ALL" ? undefined : statusFilter
    })
  })

  const copies = copiesData?.content || []
  const totalPages = copiesData?.page?.totalPages || 0

  // Retire Mutation
  const retireCopyMutation = useMutation({
    mutationFn: (id: number) => copyManagementService.retireCopy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['copies-management'] })
      toast({ title: "Copy retired", description: "Copy has been retired successfully." })
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
                    placeholder="Search by barcode..." 
                    className="pl-9"
                    value={searchBarcode}
                    onChange={(e) => { setSearchBarcode(e.target.value); setPage(0); }}
                />
            </div>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val as any); setPage(0); }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value={CopyStatus.AVAILABLE}>Available</SelectItem>
                    <SelectItem value={CopyStatus.LOANED}>Loaned</SelectItem>
                    <SelectItem value={CopyStatus.MAINTENANCE}>Maintenance</SelectItem>
                    <SelectItem value={CopyStatus.LOST}>Lost</SelectItem>
                    <SelectItem value={CopyStatus.RETIRED}>Retired</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Copy
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : copies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No copies found.
                </TableCell>
              </TableRow>
            ) : (
              copies.map((copy) => (
                <TableRow key={copy.id}>
                  <TableCell>{copy.id}</TableCell>
                  <TableCell className="font-mono">{copy.barcode}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium line-clamp-1" title={copy.book.title}>{copy.book.title}</span>
                        <span className="text-xs text-muted-foreground">{copy.book.authorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{copy.location}</TableCell>
                  <TableCell>
                    <Badge variant={
                        copy.status === CopyStatus.AVAILABLE ? "default" :
                        copy.status === CopyStatus.LOANED ? "secondary" :
                        copy.status === CopyStatus.RETIRED ? "outline" :
                        "destructive"
                    }>
                        {copy.status}
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
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => retireCopyMutation.mutate(copy.id)} className="text-destructive focus:text-destructive">
                            <Archive className="mr-2 h-4 w-4" /> Retire Copy
                        </DropdownMenuItem>
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
