"use client"

import { useQuery } from "@tanstack/react-query"
import { categoryQueries } from "@/features/categories/api/categoryQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { CategorySearchParams } from "@/features/categories/types/category"
import { CategoriesToolbar } from "./dashboard/categories-toolbar"
import { useCategoryFilters } from "../hooks/use-category-filters"
import { CategoriesTable } from "./dashboard/categories-table"

type CategoriesManagementViewProps = {
  initialFilters: CategorySearchParams
}

export function CategoriesManagementView({ initialFilters }: CategoriesManagementViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    hasActiveFilters
  } = useCategoryFilters({ initialFilters })

  const { data: categoriesData, isLoading, isFetching } = useQuery(categoryQueries.list(initialFilters))

  const categories = categoriesData?.content || []
  const totalPages = categoriesData?.page?.totalPages || 0
  const totalElements = categoriesData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <CategoriesToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
      />

      <CategoriesTable
        data={categories}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <PaginationControl
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        isLoading={isLoading || isFetching}
      />
    </div>
  )
}
