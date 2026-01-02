import { z } from "zod"

export const fineCreateSchema = z.object({
  userId: z.coerce.number().positive("User is required"),
  loanId: z.coerce.number().positive("Loan is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  reason: z.string().min(1, "Reason is required"),
})

export type FineCreateInput = z.infer<typeof fineCreateSchema>
