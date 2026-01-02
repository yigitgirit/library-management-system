import { z } from "zod"
import { NextPageSearchParams } from "@/features/common/types/search-params"

export async function parseSearchParams<T extends z.ZodType>(
  paramsPromise: Promise<NextPageSearchParams>,
  schema: T
): Promise<z.infer<T>> {
  const rawParams = await paramsPromise
  const result = schema.safeParse(rawParams)

  if (result.success) {
    return result.data
  }

  return schema.parse({})
}
