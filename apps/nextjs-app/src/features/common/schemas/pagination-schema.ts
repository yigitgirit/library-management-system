import { z } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1), // 1-based index for URL
  size: z.coerce.number().min(1).default(20),
  sort: z
    .preprocess((val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return undefined;
    }, z.array(z.string()).optional()),
})
