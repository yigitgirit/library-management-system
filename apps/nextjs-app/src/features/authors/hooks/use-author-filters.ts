"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { AuthorSearchParams } from "../types/author"

type UseAuthorFiltersProps = {
  initialFilters: AuthorSearchParams
}

export function useAuthorFilters({ initialFilters }: UseAuthorFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchQuery, setSearchQuery] = useState(initialFilters.name || "")

  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedSearch !== (initialFilters.name ?? "")) {
      updateFilters({ name: debouncedSearch || null })
    }
  }, [debouncedSearch, initialFilters.name, updateFilters])

  const setPage = useCallback((page: number) => {
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFilters = useCallback(() => {
    setSearchQuery("")
    clearFilters()
  }, [clearFilters])

  const hasActiveFilters = !!initialFilters.name

  return {
    searchQuery,
    page: initialFilters.page || 1,

    setSearchQuery,
    setPage,
    resetFilters,

    hasActiveFilters,
  }
}
