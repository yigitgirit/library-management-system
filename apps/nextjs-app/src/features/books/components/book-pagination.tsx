"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { PaginationControl } from "@/components/ui/pagination-control"

type BookPaginationProps = {
  totalPages: number
}

export function BookPagination({ totalPages }: BookPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get("page")) || 1

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (newPage > 0) {
      newSearchParams.set("page", (newPage).toString())
    } else {
      newSearchParams.delete("page")
    }
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <PaginationControl
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className="mt-8 pt-4 border-t"
    />
  )
}
