"use client"

import { DataTable } from "@/components/ui/data-table"
import { Review } from "@/features/reviews/types/review"
import { columns } from "./reviews-table-columns"

interface ReviewsTableProps {
  data: Review[]
  isLoading: boolean
  isFetching: boolean
}

export function ReviewsTable({ data, isLoading, isFetching }: ReviewsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  )
}

