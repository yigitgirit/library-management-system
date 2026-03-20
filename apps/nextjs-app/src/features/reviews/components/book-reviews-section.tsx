"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reviewQueries } from "../api/reviewQueries"
import { ReviewList } from "./review-list"
import { ReviewCard } from "./review-card"
import { ReviewForm } from "./review-form"
import { PaginationControl } from "@/components/ui/pagination-control"
import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/use-auth"

type BookReviewsSectionProps = {
  bookId: number
}

export function BookReviewsSection({
  bookId,
}: BookReviewsSectionProps) {
  const { currentUserId, isAdmin } = useAuth()
  const [page, setPage] = useState(1)

  const { data: myReview } = useQuery({
    ...reviewQueries.myReviewForBook(bookId),
    enabled: !!currentUserId,
  })

  const { data: reviewsData, isLoading, isFetching } = useQuery(
    reviewQueries.byBook(bookId, { page, size: 5 }) // Reduce items per page for a more compact view
  )

  const reviews = reviewsData?.content || []
  const totalPages = reviewsData?.page?.totalPages || 0
  const totalElements = reviewsData?.page?.totalElements || 0

  return (
    <div className="space-y-8">
      {/* My Review or Review Form - only show if user is logged in */}
      {currentUserId ? (
        <div className="mb-8">
          {myReview ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">
                My Review
              </h3>
              <ReviewCard
                review={myReview}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
              />
            </div>
          ) : (
            <ReviewForm
              bookId={bookId}
              onSuccess={() => setPage(1)}
            />
          )}
        </div>
      ) : (
        /* Login prompt - show if user is not logged in */
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to share your review and help other readers discover this book.
            </p>
            <a
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </a>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Community Reviews ({totalElements})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            isFetching={isFetching}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            excludeReviewId={myReview?.id}
          />

          {totalPages > 1 && (
            <PaginationControl
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setPage}
              isLoading={isLoading || isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
