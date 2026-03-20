"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { Review } from "../types/review"
import { StarRating } from "./star-rating"
import { format } from "date-fns"
import { useUpdateReview, useDeleteReview, useDeleteReviewAsAdmin } from "@/features/reviews/api/reviewQueries"
import { ReviewEditDialog } from "./review-edit-dialog"

type ReviewCardProps = {
  review: Review
  currentUserId?: number
  isAdmin?: boolean
  onDeleteAction?: () => void
}

export function ReviewCard({
  review,
  currentUserId,
  isAdmin = false,
  onDeleteAction,
}: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const updateReview = useUpdateReview()
  const deleteReview = useDeleteReview()
  const deleteReviewAsAdmin = useDeleteReviewAsAdmin()

  const isOwner = currentUserId === review.userId
  const canEdit = isOwner
  const canDelete = isOwner || isAdmin

  const handleDelete = () => {
    startTransition(async () => {
      try {
        if (isAdmin && !isOwner) {
          await deleteReviewAsAdmin.mutateAsync({
            id: review.id,
            bookId: review.bookId
          })
        } else {
          await deleteReview.mutateAsync({
            id: review.id,
            bookId: review.bookId
          })
        }
        onDeleteAction?.()
      } catch (error) {
        console.error("Failed to delete review:", error)
      }
    })
  }

  return (
    <>
      <Card className="bg-muted/30 border-none">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  {review.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-sm">{review.userName}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="mb-2">
                  <StarRating value={review.rating} onChangeAction={() => {}} readonly size="sm" />
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground break-words">{review.comment}</p>
                )}
              </div>
            </div>
            {canDelete && (
              <div className="flex gap-2 flex-shrink-0">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isPending || updateReview.isPending}
                    title="Edit this review"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending || deleteReview.isPending || deleteReviewAsAdmin.isPending}
                  title="Delete this review"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isEditing && canEdit && (
        <ReviewEditDialog
          review={review}
          open={isEditing}
          onOpenChangeAction={setIsEditing}
        />
      )}
    </>
  )
}

