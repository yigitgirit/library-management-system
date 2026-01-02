"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SearchParams } from "../types/search-params"

type UpdateFiltersOptions = {
  scroll?: boolean
  resetPage?: boolean
}

export function useUrlFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilters = useCallback((
    updates: SearchParams,
    options: UpdateFiltersOptions = {}
  ) => {
    const { scroll = false, resetPage = true } = options
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key)
        value.forEach(v => {
            if (v !== null && v !== undefined) {
                params.append(key, v.toString())
            }
        })
      } else {
        params.set(key, value.toString())
      }
    })

    // Reset page when filters change, unless explicitly disabled (e.g. for pagination updates)
    if (resetPage && !updates.page) {
      params.delete("page")
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll })
  }, [searchParams, router, pathname])

  const clearFilters = useCallback((options: UpdateFiltersOptions = { scroll: false }) => {
    router.push(pathname, { scroll: options.scroll })
  }, [router, pathname])

  return {
    updateFilters,
    clearFilters,
    searchParams
  }
}
