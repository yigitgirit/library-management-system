"use client"

import { useQuery } from "@tanstack/react-query"
import { copyQueries } from "@/features/copies/api/copyQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { CopySearchParams } from "@/features/copies/schemas/copy-search"
import { CopiesToolbar } from "./dashboard/copies-toolbar"
import { useCopyFilters } from "../hooks/use-copy-filters"
import { CopiesTable } from "./dashboard/copies-table"

type CopiesManagementViewProps = {
  initialFilters: CopySearchParams
}

export function CopiesManagementView({ initialFilters }: CopiesManagementViewProps) {
  const {
    searchBarcode,
    setSearchBarcodeAction,
    status,
    setStatusAction,
    bookId,
    setBookIdAction,
    page,
    setPageAction,
    resetFiltersAction,
    hasActiveFilters
  } = useCopyFilters({ initialFilters })

  const { data: copiesData, isLoading, isFetching } = useQuery(copyQueries.list(initialFilters))

  const copies = copiesData?.content || []
  const totalPages = copiesData?.page?.totalPages || 0
  const totalElements = copiesData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <CopiesToolbar
        searchBarcode={searchBarcode}
        setSearchBarcodeAction={setSearchBarcodeAction}
        status={status}
        setStatusAction={setStatusAction}
        bookId={bookId}
        setBookIdAction={setBookIdAction}
        hasActiveFilters={hasActiveFilters}
        resetFiltersAction={resetFiltersAction}
      />

      <CopiesTable
        data={copies}
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
