import { z } from "zod"
import { paginationSchema } from "@/features/common/schemas/pagination-schema"

export const reviewCreateSchema = z.object({
  bookId: z.coerce.number().positive("Book ID is required"),
  rating: z.coerce.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string()
    .min(10, "Comment is required to have at least 10 characters")
    .max(2000, "Comment must not exceed 2000 characters"),
})

export const reviewUpdateSchema = z.object({
  rating: z.coerce.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string()
    .min(1, "Comment is required")
    .max(2000, "Comment must not exceed 2000 characters"),
})

export const reviewSearchParamsSchema = paginationSchema.extend({
  bookId: z.coerce.number().optional(),
  userId: z.coerce.number().optional(),
})

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>
export type ReviewSearchParams = z.infer<typeof reviewSearchParamsSchema>
