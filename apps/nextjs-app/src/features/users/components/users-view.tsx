"use client"

import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/features/users/api/userQueries"
import { PaginationControl } from "@/components/ui/pagination-control"
import { UserSearchParams } from "@/features/users/schemas/user-search"
import { UsersToolbar } from "./dashboard/users-toolbar"
import { useUserFilters } from "../hooks/use-user-filters"
import { UsersTable } from "./dashboard/users-table"

type UsersViewProps = {
  initialFilters: UserSearchParams
}

export function UsersView({ initialFilters }: UsersViewProps) {
  const {
    searchQuery,
    setSearchQueryAction,
    page,
    setPageAction,
    resetFiltersAction,
    hasActiveFilters
  } = useUserFilters({ initialFilters })

  const { data: usersData, isLoading, isFetching } = useQuery(userQueries.list(initialFilters))

  const users = usersData?.content || []
  const totalPages = usersData?.page?.totalPages || 0
  const totalElements = usersData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchQuery={searchQuery}
        setSearchQueryAction={setSearchQueryAction}
        hasActiveFilters={hasActiveFilters}
        resetFiltersAction={resetFiltersAction}
      />

      <UsersTable
        data={users}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <PaginationControl
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPageAction}
        isLoading={isLoading || isFetching}
      />
    </div>
  )
}
