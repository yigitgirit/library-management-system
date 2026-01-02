import { z } from "zod"

const categoryBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export const categoryCreateSchema = categoryBaseSchema
export const categoryUpdateSchema = categoryBaseSchema

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
