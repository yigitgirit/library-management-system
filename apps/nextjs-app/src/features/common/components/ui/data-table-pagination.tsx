"use client"

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Button } from "@/features/common/components/ui/button"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps {
    page: number          // 0-indexed from Spring Boot
    totalPages: number    // totalPages from Page object
    totalElements?: number // Total items count
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export function DataTablePagination({
                                        page,
                                        totalPages,
                                        totalElements,
                                        onPageChange,
                                        isLoading,
                                    }: DataTablePaginationProps) {
    // Generate a dynamic range of page numbers
    const getPageNumbers = () => {
        const pages = []
        const delta = 2 // Number of pages to show on each side of current

        for (
            let i = Math.max(0, page - delta);
            i <= Math.min(totalPages - 1, page + delta);
            i++
        ) {
            pages.push(i)
        }
        return pages
    }

    // Hide pagination if there is only one page
    if (totalPages <= 1 && (!totalElements || totalElements <= 0)) return null

    return (
        <div className="flex flex-col items-center justify-center gap-4 px-2 py-4 w-full">
            {/* 1. Navigation Controls - Centered */}
            <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(0)}
                    disabled={page === 0 || isLoading}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0 || isLoading}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* 3. Sliding Window Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p) => (
                        <Button
                            key={p}
                            variant={p === page ? "default" : "outline"}
                            className={cn(
                                "h-8 w-8 p-0 transition-all",
                                p === page && "pointer-events-none shadow-sm"
                            )}
                            onClick={() => onPageChange(p)}
                            disabled={isLoading}
                        >
                            {p + 1}
                        </Button>
                    ))}
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1 || isLoading}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1 || isLoading}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>

            {/* 2. Page Metadata - Below */}
            <div className="text-sm text-muted-foreground text-center">
                Showing page <span className="font-medium text-foreground">{page + 1}</span> of{" "}
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
