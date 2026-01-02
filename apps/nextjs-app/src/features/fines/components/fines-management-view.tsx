"use client"

import { useQuery } from "@tanstack/react-query"
import { fineQueries } from "@/features/fines/api/fineQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { FineSearchParams } from "@/features/fines/schemas/fine-search"
import { FinesToolbar } from "./dashboard/fines-toolbar"
import { useFineFilters } from "../hooks/use-fine-filters"
import { FinesTable } from "./dashboard/fines-table"

type FinesManagementViewProps = {
  initialFilters: FineSearchParams
}

export function FinesManagementView({ initialFilters }: FinesManagementViewProps) {
  const {
    searchEmail,
    setSearchEmailAction,
    status,
    setStatusAction,
    page,
    setPageAction,
    resetFiltersAction,
    hasActiveFilters
  } = useFineFilters({ initialFilters })

  const { data: finesData, isLoading, isFetching } = useQuery(fineQueries.list(initialFilters))

  const fines = finesData?.content || []
  const totalPages = finesData?.page?.totalPages || 0
  const totalElements = finesData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <FinesToolbar 
        searchEmail={searchEmail}
        setSearchEmailAction={setSearchEmailAction}
        status={status}
        setStatusAction={setStatusAction}
        hasActiveFilters={hasActiveFilters}
        resetFiltersAction={resetFiltersAction}
      />

      <FinesTable 
        data={fines} 
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
