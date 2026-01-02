import { ErrorCodes } from "@/constants/error-codes"

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  timestamp: string
  error?: ApiErrorResponse
}

export interface ValidationErrorDetail {
  field: string
  message: string
  rejectedValue?: unknown
}

export interface ApiErrorResponse {
  code: string
  message: string
  details?: ValidationErrorDetail[]
}

export { ErrorCodes }

export type ErrorCodeValue = typeof ErrorCodes[keyof typeof ErrorCodes]

export class AppError extends Error {
  public readonly code: string
  public readonly details?: ValidationErrorDetail[]

  constructor(apiError: ApiErrorResponse) {
    super(apiError.message)
    this.name = "AppError"
    this.code = apiError.code
    this.details = apiError.details
  }
}
