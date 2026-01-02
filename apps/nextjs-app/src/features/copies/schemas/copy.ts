import { z } from "zod"
import { CopyStatus } from "../types/copy"

const copyBaseSchema = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  location: z.string().min(1, "Location is required"),
})

export const copyCreateSchema = copyBaseSchema.extend({
  bookId: z.coerce.number().positive("Book is required"),
})

export const copyUpdateSchema = copyBaseSchema.extend({
  status: z.nativeEnum(CopyStatus),
})

export type CopyCreateInput = z.infer<typeof copyCreateSchema>
export type CopyUpdateInput = z.infer<typeof copyUpdateSchema>
