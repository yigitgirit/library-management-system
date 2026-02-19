import { AppError } from "@/types/api"

export type ParsedApiError = {
  message: string
  validationErrors?: Record<string, string>
}

export function handleApiError(error: unknown): ParsedApiError {
  if (error instanceof AppError) {
    const validationErrors: Record<string, string> = {}

    if (error.details) {
        error.details.forEach(d => {
            validationErrors[d.field] = d.message
        })
    }

    return {
        message: error.message,
        validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: "An unexpected error occurred" }
}
