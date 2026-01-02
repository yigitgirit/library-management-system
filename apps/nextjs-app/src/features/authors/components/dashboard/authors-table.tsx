"use client"

import { DataTable } from "@/components/ui/data-table"
import { Author } from "@/features/authors/types/author"
import { columns } from "./authors-table-columns"

interface AuthorsTableProps {
  data: Author[]
  isLoading: boolean
  isFetching: boolean
}

export function AuthorsTable({ data, isLoading, isFetching }: AuthorsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
