import { z } from "zod"

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
  coverImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export const bookCreateSchema = bookBaseSchema
export const bookUpdateSchema = bookBaseSchema

export type BookCreateInput = z.infer<typeof bookCreateSchema>
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>
