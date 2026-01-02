"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { LoanSearchParams } from "../schemas/loan-search"
import { LoanStatus } from "../types/loan"

type UseLoanFiltersProps = {
  initialFilters: LoanSearchParams
}

export function useLoanFilters({ initialFilters }: UseLoanFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchEmail, setSearchEmail] = useState(initialFilters.userEmail || "")
  
  const debouncedEmail = useDebounce(searchEmail, 500)

  useEffect(() => {
    if (debouncedEmail !== (initialFilters.userEmail ?? "")) {
      updateFilters({ userEmail: debouncedEmail || null })
    }
  }, [debouncedEmail, initialFilters.userEmail, updateFilters])

  const setBookIdAction = useCallback((id: number | null) => {
    updateFilters({ bookId: id })
  }, [updateFilters])

  const setStatusAction = useCallback((status: LoanStatus | "ALL") => {
    updateFilters({ status: status === "ALL" ? null : status })
  }, [updateFilters])

  const setPageAction = useCallback((page: number) => {
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFiltersAction = useCallback(() => {
    setSearchEmail("")
    clearFilters()
  }, [clearFilters])

  const hasActiveFilters = !!(
    initialFilters.userEmail || 
    initialFilters.bookId || 
    initialFilters.status
  )

  const currentStatus: LoanStatus | "ALL" = initialFilters.status || "ALL"

  return {
    searchEmail,
    bookId: initialFilters.bookId || null,
    status: currentStatus,
    page: initialFilters.page || 1,
    
    setSearchEmailAction: setSearchEmail,
    setBookIdAction,
    setStatusAction,
    setPageAction,
    resetFiltersAction,
    
    hasActiveFilters,
  }
}
