"use client"

import { useQuery } from "@tanstack/react-query"
import { authorQueries } from "@/features/authors/api/authorQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { AuthorSearchParams } from "@/features/authors/types/author"
import { AuthorsToolbar } from "./dashboard/authors-toolbar"
import { useAuthorFilters } from "../hooks/use-author-filters"
import { AuthorsTable } from "./dashboard/authors-table"

type AuthorsManagementViewProps = {
  initialFilters: AuthorSearchParams
}

export function AuthorsManagementView({ initialFilters }: AuthorsManagementViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    hasActiveFilters
  } = useAuthorFilters({ initialFilters })

  const { data: authorsData, isLoading, isFetching } = useQuery(authorQueries.list(initialFilters))

  const authors = authorsData?.content || []
  const totalPages = authorsData?.page?.totalPages || 0
  const totalElements = authorsData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <AuthorsToolbar
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQuery}
        hasActiveFilters={hasActiveFilters}
        resetFiltersAction={resetFilters}
      />

      <AuthorsTable
        data={authors}
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
