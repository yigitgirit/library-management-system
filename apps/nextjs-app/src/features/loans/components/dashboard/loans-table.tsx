"use client"

import { DataTable } from "@/components/ui/data-table"
import { Loan } from "@/features/loans/types/loan"
import { columns } from "./loans-table-columns"

interface LoansTableProps {
  data: Loan[]
  isLoading: boolean
  isFetching: boolean
}

export function LoansTable({ data, isLoading, isFetching }: LoansTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
