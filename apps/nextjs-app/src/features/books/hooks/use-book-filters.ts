"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { BookSearchParams } from "../schemas/book-search"

type UseBookFiltersProps = {
  initialFilters: BookSearchParams
}

export function useBookFilters({ initialFilters }: UseBookFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || "")
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || "")

  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedSearch !== (initialFilters.search ?? "")) {
      updateFilters({ search: debouncedSearch || null })
    }
  }, [debouncedSearch, initialFilters.search, updateFilters])

  const setCategoryIdsAction = useCallback((categoryIds: number[]) => {
    updateFilters({ categoryIds })
  }, [updateFilters])

  const setAvailableAction = useCallback((available: boolean | null) => {
    updateFilters({ available: available ? "true" : null })
  }, [updateFilters])

  const applyPriceFilterAction = useCallback(() => {
    updateFilters({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    })
  }, [minPrice, maxPrice, updateFilters])

  const setPageAction = useCallback((page: number) => {
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFiltersAction = useCallback(() => {
    setSearchQuery("")
    setMinPrice("")
    setMaxPrice("")
    clearFilters()
  }, [clearFilters])

  const hasActiveFilters = !!(
    (initialFilters.categoryIds?.length ?? 0) > 0 ||
    initialFilters.available ||
    initialFilters.minPrice ||
    initialFilters.maxPrice ||
    initialFilters.search
  )

  return {
    searchQuery,
    minPrice,
    maxPrice,
    page: initialFilters.page || 1,

    setSearchQueryAction: setSearchQuery,
    setMinPriceAction: setMinPrice,
    setMaxPriceAction: setMaxPrice,
    setCategoryIdsAction,
    setAvailableAction,
    applyPriceFilterAction,
    setPageAction,
    resetFiltersAction,

    hasActiveFilters,
  }
}
