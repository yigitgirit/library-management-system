import { z } from "zod"

export const loanCreateSchema = z.object({
  userId: z.coerce.number().positive("User is required"),
  copyId: z.coerce.number().positive("Copy is required"),
  dueDate: z.string().optional(), // ISO Date string
})

export const loanReportDamagedSchema = z.object({
  damageAmount: z.coerce.number().min(0, "Amount must be positive"),
  damageDescription: z.string().min(1, "Description is required"),
})

export type LoanCreateInput = z.infer<typeof loanCreateSchema>
export type LoanReportDamagedInput = z.infer<typeof loanReportDamagedSchema>
