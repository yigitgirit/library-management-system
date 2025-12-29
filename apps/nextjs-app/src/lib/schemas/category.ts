import { z } from "zod"
import type { CategoryCreateRequest, CategoryUpdateRequest } from "@/lib/api"

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
}) satisfies z.ZodType<CategoryCreateRequest>

// Update schema is identical for now
export const categoryUpdateSchema = categorySchema satisfies z.ZodType<CategoryUpdateRequest>

export type CategoryInput = z.infer<typeof categorySchema>