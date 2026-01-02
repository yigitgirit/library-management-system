"use client"

import { useState, useEffect, useCallback } from "react"
import { useUrlFilters } from "@/features/common/hooks/use-url-filters"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { CopySearchParams } from "../schemas/copy-search"
import { CopyStatus } from "../types/copy"

type UseCopyFiltersProps = {
  initialFilters: CopySearchParams
}

export function useCopyFilters({ initialFilters }: UseCopyFiltersProps) {
  const { updateFilters, clearFilters } = useUrlFilters()

  const [searchBarcode, setSearchBarcode] = useState(initialFilters.barcode || "")

  const debouncedBarcode = useDebounce(searchBarcode, 500)

  useEffect(() => {
    if (debouncedBarcode !== (initialFilters.barcode ?? "")) {
      updateFilters({ barcode: debouncedBarcode || null })
    }
  }, [debouncedBarcode, initialFilters.barcode, updateFilters])

  const setStatusAction = useCallback((status: CopyStatus | "ALL") => {
    updateFilters({ copyStatus: status === "ALL" ? null : status })
  }, [updateFilters])

  const setBookIdAction = useCallback((bookId: number | null) => {
    updateFilters({ bookId: bookId || null })
  }, [updateFilters])

  const setPageAction = useCallback((page: number) => {
    updateFilters({ page }, { scroll: true, resetPage: false })
  }, [updateFilters])

  const resetFiltersAction = useCallback(() => {
    setSearchBarcode("")
    clearFilters()
  }, [clearFilters])

  const hasActiveFilters = !!(
    initialFilters.barcode || 
    initialFilters.copyStatus ||
    initialFilters.bookId
  )

  const currentStatus: CopyStatus | "ALL" = initialFilters.copyStatus || "ALL"

  return {
    searchBarcode,
    status: currentStatus,
    bookId: initialFilters.bookId || null,
    page: initialFilters.page || 1,
    
    setSearchBarcodeAction: setSearchBarcode,
    setStatusAction,
    setBookIdAction,
    setPageAction,
    resetFiltersAction,
    
    hasActiveFilters,
  }
}
