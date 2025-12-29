import { z } from "zod"
import type { BookCreateRequest, BookUpdateRequest } from "@/lib/api"

// Common fields shared between Create and Update
const bookBaseSchema = z.object({
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  pageCount: z.coerce.number().int().positive().optional(),
  language: z.string().optional(),
  format: z.string().optional(),
  authorIds: z.array(z.number()).min(1, "Select at least one author"),
  categoryId: z.coerce.number().positive("Select a category"),
})

export const bookCreateSchema = bookBaseSchema.extend({
  // Optional in Create
  coverImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
}) satisfies z.ZodType<BookCreateRequest>

export const bookUpdateSchema = bookBaseSchema.extend({
  // Required in Update DTO (but we allow empty string if backend handles it, 
  // though strictly it expects a string)
  coverImageUrl: z.string().url("Invalid URL").or(z.literal("")),
}) satisfies z.ZodType<BookUpdateRequest>

export type BookCreateInput = z.infer<typeof bookCreateSchema>
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>

// Unified type for the form (can be used for both if you handle the optionality in UI)
export type BookFormValues = BookCreateInput | BookUpdateInput