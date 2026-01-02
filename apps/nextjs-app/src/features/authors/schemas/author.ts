import { z } from "zod"

const authorBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  biography: z.string().optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
})

export const authorCreateSchema = authorBaseSchema
export const authorUpdateSchema = authorBaseSchema

export type AuthorCreateInput = z.infer<typeof authorCreateSchema>
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>
