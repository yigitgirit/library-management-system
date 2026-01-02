"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { FineSearchParams } from "../schemas/fine-search"
import { FineStatus } from "../types/fine"

type UseFineFiltersProps = {
  initialFilters: FineSearchParams
}

export function useFineFilters({ initialFilters }: UseFineFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchEmail, setSearchEmail] = useState(initialFilters.userEmail || "")

  const debouncedEmail = useDebounce(searchEmail, 500)

  useEffect(() => {
    if (debouncedEmail !== (initialFilters.userEmail ?? "")) {
      updateFilters({ userEmail: debouncedEmail || null })
    }
  }, [debouncedEmail, initialFilters.userEmail, updateFilters])

  const setStatusAction = useCallback((status: FineStatus | "ALL") => {
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
    initialFilters.status
  )

  const currentStatus: FineStatus | "ALL" = initialFilters.status || "ALL"

  return {
    searchEmail,
    status: currentStatus,
    page: initialFilters.page || 1,
    
    setSearchEmailAction: setSearchEmail,
    setStatusAction,
    setPageAction,
    resetFiltersAction,
    
    hasActiveFilters,
  }
}
