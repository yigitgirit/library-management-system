"use client"

import { useQuery } from "@tanstack/react-query"
import { BookSearchParams } from "@/features/books/schemas/book-search"
import { PaginationControl } from "@/components/ui/pagination-control"
import { bookQueries } from "@/features/books/api/bookQueries"
import { useBookFilters } from "@/features/books/hooks/use-book-filters"
import { BooksToolbar } from "./books-toolbar"
import { BooksTable } from "./books-table"

type BooksManagementViewProps = {
  initialFilters: BookSearchParams
}

export function BooksManagementView({ initialFilters }: BooksManagementViewProps) {
  const {
    searchQuery,
    setSearchQueryAction,
    minPrice,
    setMinPriceAction,
    maxPrice,
    setMaxPriceAction,
    setCategoryIdsAction,
    setAvailableAction,
    applyPriceFilterAction,
    page,
    setPageAction,
    resetFiltersAction,
    hasActiveFilters
  } = useBookFilters({ initialFilters })

  const { data: booksData, isLoading, isFetching } = useQuery(bookQueries.list(initialFilters))

  const books = booksData?.content || []
  const totalPages = booksData?.page?.totalPages || 0
  const totalElements = booksData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <BooksToolbar 
        initialFilters={initialFilters}
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQueryAction}
        minPrice={minPrice}
        setMinPriceAction={setMinPriceAction}
        maxPrice={maxPrice}
        setMaxPriceAction={setMaxPriceAction}
        setCategoryIdsAction={setCategoryIdsAction}
        setAvailableAction={setAvailableAction}
        applyPriceFilterAction={applyPriceFilterAction}
        resetFiltersAction={resetFiltersAction}
        hasActiveFilters={hasActiveFilters}
      />

      <BooksTable 
        data={books} 
        isLoading={isLoading} 
        isFetching={isFetching} 
      />

      <PaginationControl
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPageAction}
          isLoading={isLoading || isFetching}
      />
    </div>
  )
}
