"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  X,
  Filter,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CopyStatus } from "@/features/copies/types/copy"
import { ToolbarLayout } from "@/components/ui/toolbar-layout"
import Link from "next/link"
import { AsyncCombobox } from "@/components/ui/async-combobox"
import { bookService } from "@/features/books/services/bookService"
import { isIsbnLike } from "@/lib/validators"
import { useCallback, useState } from "react";
import { Book } from "@/features/books/types/book"

type CopiesToolbarProps = {
  searchBarcode: string
  setSearchBarcodeAction: (value: string) => void
  status: CopyStatus | "ALL"
  setStatusAction: (status: CopyStatus | "ALL") => void
  bookId: number | null
  setBookIdAction: (id: number | null) => void
  hasActiveFilters: boolean
  resetFiltersAction: () => void
}

export function CopiesToolbar({ 
  searchBarcode, 
  setSearchBarcodeAction, 
  status, 
  setStatusAction, 
  bookId,
  setBookIdAction,
  hasActiveFilters, 
  resetFiltersAction 
}: CopiesToolbarProps) {

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
          {/* Search Barcode */}
          <div className="relative w-full sm:w-64 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by barcode..."
              className="pl-9 h-9"
              value={searchBarcode}
              onChange={(e) => setSearchBarcodeAction(e.target.value)}
            />
          </div>

          {/* Filter by Book (ISBN/Title) */}
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
            onValueChange={(val) => setStatusAction(val as CopyStatus | "ALL")}
          >
            <SelectTrigger className="w-[160px] h-9">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                </div>
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
          <Link href="/dashboard/copies/create">
            <Plus className="mr-2 h-4 w-4" /> Add Copy
          </Link>
        </Button>
      }
    />
  )
}
