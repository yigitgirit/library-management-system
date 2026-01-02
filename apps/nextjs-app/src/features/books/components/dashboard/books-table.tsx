"use client"

import { DataTable } from "@/components/ui/data-table"
import { Book } from "@/features/books/types/book"
import { columns } from "./books-table-columns"

interface BooksTableProps {
  data: Book[]
  isLoading: boolean
  isFetching: boolean
}

export function BooksTable({ data, isLoading, isFetching }: BooksTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}
