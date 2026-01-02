import { z } from "zod"
import { LoanStatus } from "../types/loan"
import { paginationSchema } from "@/features/common/schemas/pagination-schema"

export const loanSearchParamsSchema = paginationSchema.extend({
    userId: z.coerce.number().optional(),
    userEmail: z.string().optional(),
    copyId: z.coerce.number().optional(),
    barcode: z.string().optional(),
    bookId: z.coerce.number().optional(),
    isbn: z.string().optional(),
    bookTitle: z.string().optional(),
    status: z.nativeEnum(LoanStatus).optional(),
    overdue: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
    }, z.boolean().optional()),
});

export type LoanSearchParams = z.infer<typeof loanSearchParamsSchema>
