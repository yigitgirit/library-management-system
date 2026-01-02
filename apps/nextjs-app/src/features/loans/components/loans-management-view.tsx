"use client"

import { useQuery } from "@tanstack/react-query"
import { loanQueries } from "@/features/loans/api/loanQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { LoanSearchParams } from "@/features/loans/schemas/loan-search"
import { LoansToolbar } from "./dashboard/loans-toolbar"
import { useLoanFilters } from "../hooks/use-loan-filters"
import { LoansTable } from "./dashboard/loans-table"

type LoansManagementViewProps = {
  initialFilters: LoanSearchParams
}

export function LoansManagementView({ initialFilters }: LoansManagementViewProps) {
  const {
    searchEmail,
    setSearchEmailAction,
    bookId,
    setBookIdAction,
    status,
    setStatusAction,
    page,
    setPageAction,
    resetFiltersAction,
    hasActiveFilters
  } = useLoanFilters({ initialFilters })

  const { data: loansData, isLoading, isFetching } = useQuery(loanQueries.list(initialFilters))

  const loans = loansData?.content || []
  const totalPages = loansData?.page?.totalPages || 0
  const totalElements = loansData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <LoansToolbar
        searchEmail={searchEmail}
        setSearchEmailAction={setSearchEmailAction}
        bookId={bookId}
        setBookIdAction={setBookIdAction}
        status={status}
        setStatusAction={setStatusAction}
        hasActiveFilters={hasActiveFilters}
        resetFiltersAction={resetFiltersAction}
      />

      <LoansTable
        data={loans}
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
