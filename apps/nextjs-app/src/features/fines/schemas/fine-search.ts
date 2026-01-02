import { z } from "zod"
import { FineStatus } from "../types/fine"

export const fineSearchParamsSchema = z.object({
    page: z.coerce.number().min(0).default(0),
    size: z.coerce.number().min(1).default(20),
    sort: z
        .preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return [val];
            return undefined;
        }, z.array(z.string()).optional()),
    userId: z.coerce.number().optional(),
    userEmail: z.string().optional(),
    loanId: z.coerce.number().optional(),
    bookId: z.coerce.number().optional(),
    status: z.nativeEnum(FineStatus).optional(),
    minAmount: z.coerce.number().optional(),
    maxAmount: z.coerce.number().optional(),
});

export type FineSearchParams = z.infer<typeof fineSearchParamsSchema>
