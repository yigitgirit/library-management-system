"use client"

import {
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

interface PaginationControlProps {
    page: number          // 1-indexed
    totalPages: number
    totalElements?: number
    onPageChange: (page: number) => void
    isLoading?: boolean
    className?: string
}

export function PaginationControl({
                                        page,
                                        totalPages,
                                        totalElements,
                                        onPageChange,
                                        isLoading,
                                        className
                                    }: PaginationControlProps) {
    // Generate a dynamic range of page numbers
    const getPageNumbers = () => {
        const pages = []
        const delta = 2 // Number of pages to show on each side of current

        for (
            let i = Math.max(1, page - delta);
            i <= Math.min(totalPages, page + delta);
            i++
        ) {
            pages.push(i)
        }
        return pages
    }

    // Hide pagination if there is only one page
    if (totalPages <= 1 && (!totalElements || totalElements <= 0)) return null

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4 px-2 py-4 w-full", className)}>
            <Pagination>
                <PaginationContent>
                    {/* First Page */}
                    <PaginationItem className="hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1 || isLoading}
                            aria-label="Go to first page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                    </PaginationItem>

                    {/* Previous Page */}
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault()
                                if (page > 1 && !isLoading) onPageChange(page - 1)
                            }}
                            aria-disabled={page === 1 || isLoading}
                            className={cn(page === 1 || isLoading ? "pointer-events-none opacity-50" : "")}
                        />
                    </PaginationItem>

                    {/* Sliding Window Page Numbers */}
                    {getPageNumbers().map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (!isLoading) onPageChange(p)
                                }}
                                aria-disabled={isLoading}
                                className={cn(isLoading ? "pointer-events-none" : "")}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Next Page */}
                    <PaginationItem>
                        <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault()
                                if (page < totalPages && !isLoading) onPageChange(page + 1)
                            }}
                            aria-disabled={page >= totalPages || isLoading}
                            className={cn(page >= totalPages || isLoading ? "pointer-events-none opacity-50" : "")}
                        />
                    </PaginationItem>

                    {/* Last Page */}
                    <PaginationItem className="hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages || isLoading}
                            aria-label="Go to last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Page Metadata */}
            <div className="text-sm text-muted-foreground text-center">
                Showing page <span className="font-medium text-foreground">{page}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
                {totalElements !== undefined && (
                    <>
                        {" "}from <span className="font-medium text-foreground">{totalElements}</span> total items
                    </>
                )}
            </div>
        </div>
    )
}
