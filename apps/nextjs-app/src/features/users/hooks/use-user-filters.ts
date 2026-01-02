"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { UserSearchParams } from "../schemas/user-search"

type UseUserFiltersProps = {
  initialFilters: UserSearchParams
}

export function useUserFilters({ initialFilters }: UseUserFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")

  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedSearch !== (initialFilters.search ?? "")) {
      updateFilters({ search: debouncedSearch || null })
    }
  }, [debouncedSearch, initialFilters.search, updateFilters])

  const setPageAction = useCallback((page: number) => {
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFiltersAction = useCallback(() => {
    setSearchQuery("")
    clearFilters()
  }, [clearFilters])

  const hasActiveFilters = !!initialFilters.search

  return {
    searchQuery,
    page: initialFilters.page || 1,
    
    setSearchQueryAction: setSearchQuery,
    setPageAction,
    resetFiltersAction,
    
    hasActiveFilters,
  }
}
