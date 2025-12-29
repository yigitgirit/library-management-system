"use client"

import { useQuery } from "@tanstack/react-query"
import { BookControllerService } from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { BookSearchParams } from "@/lib/validations/book-search"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { columns } from "./books-columns"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import {useCallback} from "react";

type BooksContentProps = {
  params: BookSearchParams
}

export function BooksContent({ params }: BooksContentProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const {data: booksData, isLoading, isFetching} = useQuery({
        queryKey: ['books-management', params],
        queryFn: () => BookControllerService.getAllBooks({
            ...params,
            page: params.page > 0 ? params.page - 1 : 0,
            sort: params.sort ? [params.sort] : undefined,
            }
        ),
        placeholderData: (previousData) => previousData,
    })

  const books = booksData?.data?.content || []
  const totalPages = booksData?.data?.page?.totalPages || 0
  const totalElements = booksData?.data?.page?.totalElements || 0

  const handlePageChange = useCallback((newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("page", newPage.toString())
    router.push(`${pathname}?${current.toString()}`)
  }, [searchParams, router, pathname])

  return (
    <div className="space-y-4">
      <DataTable
          columns={columns}
          data={books}
          isLoading={isLoading}
          isFetching={isFetching}
      />

      <DataTablePagination
          page={params.page ?? 0}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={handlePageChange}
          isLoading={isLoading}
      />
    </div>
  )
}
