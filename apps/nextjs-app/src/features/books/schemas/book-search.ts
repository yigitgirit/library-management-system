import { z } from "zod"
import { paginationSchema } from "@/features/common/schemas/pagination-schema"

export const bookSearchParamsSchema = paginationSchema.extend({
    search: z.string().optional(),
    isbn: z.string().optional(),
    title: z.string().optional(),
    authorName: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    categoryIds: z
        .preprocess((val) => {
            if (!val) return undefined;
            const arr = Array.isArray(val) ? val : [val];
            return arr.map(Number);
        }, z.array(z.number()).optional()),
    available: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
    }, z.boolean().optional()),
});

export type BookSearchParams = z.infer<typeof bookSearchParamsSchema>
