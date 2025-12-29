import { z } from "zod"

export const bookSearchParamsSchema = z.object({
    page: z.coerce.number().min(0).default(0),
    size: z.coerce.number().min(1).default(20),
    sort: z
        .preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string())
        .optional(), // API wants Array<string>, we'll wrap this later
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