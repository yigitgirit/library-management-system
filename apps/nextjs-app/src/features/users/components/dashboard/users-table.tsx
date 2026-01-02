"use client"

import { DataTable } from "@/components/ui/data-table"
import { User } from "@/features/users/types/user"
import { columns } from "./users-table-columns"

interface UsersTableProps {
  data: User[]
  isLoading: boolean
  isFetching: boolean
}

export function UsersTable({ data, isLoading, isFetching }: UsersTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
