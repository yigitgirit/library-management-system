"use client"

import { DataTable } from "@/components/ui/data-table"
import { Copy } from "@/features/copies/types/copy"
import { columns } from "./copies-table-columns"

interface CopiesTableProps {
  data: Copy[]
  isLoading: boolean
  isFetching: boolean
}

export function CopiesTable({ data, isLoading, isFetching }: CopiesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
