"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateReview } from "@/features/reviews/api/reviewQueries"
import { reviewCreateSchema, ReviewCreateInput } from "@/features/reviews/schemas/review"
import { StarRating } from "./star-rating"

type ReviewFormProps = {
  bookId: number
  onSuccess?: () => void
}

export function ReviewForm({ bookId, onSuccess }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition()
  const createReview = useCreateReview()

  const form = useForm<ReviewCreateInput>({
    resolver: zodResolver(reviewCreateSchema),
    defaultValues: {
      bookId,
      rating: 5,
      comment: "",
    },
  })

  function onSubmit(data: ReviewCreateInput) {
    startTransition(async () => {
      try {
        await createReview.mutateAsync(data)
        form.reset()
        onSuccess?.()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create review"
        form.setError("root", { message })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your thoughts about this book</CardDescription>
      </CardHeader>
      <CardContent>
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
                      onChange={field.onChange}
                      disabled={isPending || createReview.isPending}
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
                      disabled={isPending || createReview.isPending}
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

            <Button
              type="submit"
              disabled={isPending || createReview.isPending}
              className="w-full"
            >
              {isPending || createReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}