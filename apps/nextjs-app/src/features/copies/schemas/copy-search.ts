import { z } from "zod"
import { CopyStatus } from "../types/copy"

export const copySearchParamsSchema = z.object({
    page: z.coerce.number().min(0).default(0),
    size: z.coerce.number().min(1).default(20),
    sort: z
        .preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return [val];
            return undefined;
        }, z.array(z.string()).optional()),
    barcode: z.string().optional(),
    isbn: z.string().optional(),
    bookId: z.coerce.number().optional(),
    copyStatus: z.nativeEnum(CopyStatus).optional(), // Changed from status to copyStatus
});

export type CopySearchParams = z.infer<typeof copySearchParamsSchema>
