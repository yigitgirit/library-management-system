import { z } from "zod"
import type { AuthorCreateRequest, AuthorUpdateRequest } from "@/lib/api"

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
}) satisfies z.ZodType<AuthorCreateRequest>

// Update schema is identical for now
export const authorUpdateSchema = authorSchema satisfies z.ZodType<AuthorUpdateRequest>

export type AuthorInput = z.infer<typeof authorSchema>