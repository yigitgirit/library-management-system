"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface BookPaginationProps {
  totalPages: number
}

export function BookPagination({ totalPages }: BookPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL is 1-based
  const currentPage = Number(searchParams.get("page")) || 1

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (newPage > 1) {
      newSearchParams.set("page", newPage.toString())
    } else {
      newSearchParams.delete("page")
    }
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8 pt-4 border-t">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
