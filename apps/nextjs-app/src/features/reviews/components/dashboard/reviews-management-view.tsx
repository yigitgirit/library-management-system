"use client"

import { useQuery } from "@tanstack/react-query"
import { ReviewSearchParams } from "@/features/reviews/schemas/review"
import { PaginationControl } from "@/components/ui/pagination-control"
import { reviewQueries } from "@/features/reviews/api/reviewQueries"
import { useReviewFilters } from "@/features/reviews/hooks/use-review-filters"
import { ReviewsToolbar } from "./reviews-toolbar"
import { ReviewsTable } from "./reviews-table"

type ReviewsManagementViewProps = {
  initialFilters: ReviewSearchParams
}

export function ReviewsManagementView({ initialFilters }: ReviewsManagementViewProps) {
  const {
    page,
    setPageAction,
    resetFiltersAction,
  } = useReviewFilters({ initialFilters })

  const { data: reviewsData, isLoading, isFetching } = useQuery(
    reviewQueries.list(initialFilters)
  )

  const reviews = reviewsData?.content || []
  const totalPages = reviewsData?.page?.totalPages || 0
  const totalElements = reviewsData?.page?.totalElements || 0

  return (
    <div className="space-y-4">
      <ReviewsToolbar
        resetFiltersAction={resetFiltersAction}
      />

      <ReviewsTable
        data={reviews}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <PaginationControl
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPageAction}
        isLoading={isLoading || isFetching}
      />
    </div>
  )
}

