"use client"

import { DataTable } from "@/components/ui/data-table"
import { Category } from "@/features/categories/types/category"
import { columns } from "./categories-table-columns"

interface CategoriesTableProps {
  data: Category[]
  isLoading: boolean
  isFetching: boolean
}

export function CategoriesTable({ data, isLoading, isFetching }: CategoriesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
