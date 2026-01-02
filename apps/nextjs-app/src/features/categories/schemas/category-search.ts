import { z } from "zod"

export const categorySearchParamsSchema = z.object({
    page: z.coerce.number().min(0).default(0),
    size: z.coerce.number().min(1).default(20),
    sort: z
        .preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return [val];
            return undefined;
        }, z.array(z.string()).optional()),
    name: z.string().optional(),
});

export type CategorySearchParams = z.infer<typeof categorySearchParamsSchema>
