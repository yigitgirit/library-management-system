"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  X,
  Filter,
  Plus,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoanStatus } from "@/features/loans/types/loan"
import { ToolbarLayout } from "@/components/ui/toolbar-layout"
import Link from "next/link"
import { AsyncCombobox } from "@/components/ui/async-combobox"
import { bookService } from "@/features/books/services/bookService"
import { isIsbnLike } from "@/lib/validators"
import { useCallback } from "react"
import { Book } from "@/features/books/types/book"

type LoansToolbarProps = {
    searchEmail: string
    setSearchEmailAction: (value: string) => void
    bookId: number | null
    setBookIdAction: (id: number | null) => void
    status: LoanStatus | "ALL"
    setStatusAction: (status: LoanStatus | "ALL") => void
    hasActiveFilters: boolean
    resetFiltersAction: () => void
}

export function LoansToolbar({ 
    searchEmail,
    setSearchEmailAction,
    bookId,
    setBookIdAction,
    status,
    setStatusAction,
    hasActiveFilters,
    resetFiltersAction
}: LoansToolbarProps) {

  const fetchBooks = useCallback(async (search: string) => {
    const params = isIsbnLike(search) ? { isbn: search } : { title: search }
    const res = await bookService.getAll({ ...params, size: 20 })
    return res.content || []
  }, [])

  const mapBookOption = useCallback((item: Book) => ({
    value: item.id,
    label: `${item.title} (ISBN: ${item.isbn})`
  }), [])
  
  return (
    <ToolbarLayout
      filters={
        <>
          {/* Search Email */}
          <div className="relative w-full sm:w-56 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user email..."
              className="pl-9 h-9"
              value={searchEmail}
              onChange={(e) => setSearchEmailAction(e.target.value)}
            />
          </div>

          {/* Search Book */}
          <div className="w-full sm:w-72 h-9">
            <AsyncCombobox<Book>
              value={bookId || 0}
              onChange={(val) => setBookIdAction(val ? Number(val) : null)}
              fetchOptions={fetchBooks}
              mapOption={mapBookOption}
              placeholder="Filter by book..."
              searchPlaceholder="Search by title or ISBN..."
              className="h-9"
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={status} 
            onValueChange={(val) => setStatusAction(val as LoanStatus | "ALL")}
          >
            <SelectTrigger className="w-[160px] h-9">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={LoanStatus.OVERDUE}>Overdue</SelectItem>
                <SelectItem value={LoanStatus.RETURNED}>Returned</SelectItem>
                <SelectItem value={LoanStatus.LOST}>Lost</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear All */}
          {hasActiveFilters && (
            <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFiltersAction}
            >
              Clear all
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </>
      }
      actions={
        <Button className="h-9" asChild>
          <Link href="/dashboard/loans/create">
            <Plus className="mr-2 h-4 w-4" /> Create Loan
          </Link>
        </Button>
      }
    />
  )
}
