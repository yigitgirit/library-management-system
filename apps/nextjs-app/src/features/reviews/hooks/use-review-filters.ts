"use client"

import { useState, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { ReviewSearchParams } from "../schemas/review"

type UseReviewFiltersProps = {
  initialFilters: ReviewSearchParams
}

export function useReviewFilters({ initialFilters }: UseReviewFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [page, setPage] = useState(initialFilters.page || 1)

  const setPageAction = useCallback((page: number) => {
    setPage(page)
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFiltersAction = useCallback(() => {
    setPage(1)
    clearFilters()
  }, [clearFilters])

  return {
    page,
    setPageAction,
    resetFiltersAction,
  }
}

