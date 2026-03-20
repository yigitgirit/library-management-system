"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Review } from "../types/review"
import { reviewUpdateSchema, ReviewUpdateInput } from "../schemas/review"
import { useUpdateReview } from "@/features/reviews/api/reviewQueries"
import { StarRating } from "./star-rating"

type ReviewEditDialogProps = {
  review: Review
  open: boolean
  onOpenChangeAction: (open: boolean) => void
}

export function ReviewEditDialog({ review, open, onOpenChangeAction }: ReviewEditDialogProps) {
  const [isPending, startTransition] = useTransition()
  const updateReview = useUpdateReview()

  const form = useForm<ReviewUpdateInput>({
    resolver: zodResolver(reviewUpdateSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment || "",
    },
  })

  function onSubmit(data: ReviewUpdateInput) {
    startTransition(async () => {
      try {
        await updateReview.mutateAsync({
          id: review.id,
          data,
        })
        onOpenChangeAction(false)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update review"
        form.setError("root", { message })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>Update your review for this book</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChangeAction={field.onChange}
                      disabled={isPending || updateReview.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-24 resize-none"
                      {...field}
                      disabled={isPending || updateReview.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChangeAction(false)}
                disabled={isPending || updateReview.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || updateReview.isPending}
              >
                {isPending || updateReview.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

