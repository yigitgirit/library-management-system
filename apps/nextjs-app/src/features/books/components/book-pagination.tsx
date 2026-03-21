"use client"

import {useTransition} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {ChevronLeft, ChevronRight, MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"

type BookPaginationProps = {
  totalPages: number
}

export function BookPagination({ totalPages }: BookPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = Number(searchParams.get("page")) || 1

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return

    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (newPage > 1) {
        newSearchParams.set("page", newPage.toString())
      } else {
        newSearchParams.delete("page")
      }
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    })
  }

  if (totalPages <= 1) return null

  // Generate pagination array with ellipses
  const generatePagination = () => {
    const pages: (number | "...")[] = []
    
    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    // Determine the range around current page
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if at edges to always show 3 numbers when possible
    if (currentPage <= 2) {
      end = Math.min(totalPages - 1, 3)
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(2, totalPages - 2)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const paginationItems = generatePagination()

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-border",
      isPending && "opacity-60 pointer-events-none transition-opacity duration-200"
    )}>
      
      {/* Mobile/Tablet simple text indicator */}
      <div className="text-sm font-medium text-muted-foreground sm:hidden">
        Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="w-full sm:w-auto h-9 px-4 font-medium border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4 mr-1.5" />
        Previous
      </Button>

      {/* Desktop/Tablet number strip */}
      <div className="hidden sm:flex items-center gap-1.5">
        {paginationItems.map((item, index) => {
          if (item === "...") {
            return (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )
          }

          const isCurrent = currentPage === item
          return (
            <Button
              key={`page-${item}`}
              variant={isCurrent ? "default" : "ghost"}
              size="icon"
              onClick={() => handlePageChange(item)}
              disabled={isPending}
              className={cn(
                "h-9 w-9 text-sm font-medium transition-all rounded-md",
                isCurrent 
                  ? "bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-800 dark:hover:bg-emerald-700 shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {item}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="w-full sm:w-auto h-9 px-4 font-medium border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1.5" />
      </Button>
    </div>
  )
}
