"use client"

import { DataTable } from "@/components/ui/data-table"
import { Fine } from "@/features/fines/types/fine"
import { columns } from "./fines-table-columns"

interface FinesTableProps {
  data: Fine[]
  isLoading: boolean
  isFetching: boolean
}

export function FinesTable({ data, isLoading, isFetching }: FinesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
