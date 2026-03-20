"use client"

import { Review } from "../types/review"
import { ReviewCard } from "./review-card"
import { Skeleton } from "@/components/ui/skeleton"

type ReviewListProps = {
  reviews: Review[]
  isLoading?: boolean
  isFetching?: boolean
  currentUserId?: number
  isAdmin?: boolean
  excludeReviewId?: number
}

export function ReviewList({
  reviews,
  isLoading = false,
  isFetching = false,
  currentUserId,
  isAdmin = false,
  excludeReviewId,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  const filteredReviews = excludeReviewId
    ? reviews.filter((r) => r.id !== excludeReviewId)
    : reviews;

  return (
    <div className="space-y-4">
      {filteredReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}
