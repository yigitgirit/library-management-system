"use server"

import { cookies } from "next/headers"
import { createApiClient } from "./base-client"
import { AppError } from "@/types/api"
import { AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Server-side token provider using Next.js cookies
const serverTokenProvider = async () => {
  try {
    const cookieStore = await cookies()
    return cookieStore.get("accessToken")?.value
  } catch (error) {
    // This happens if called outside of request context (e.g. static generation)
    return null
  }
}

// Server-side error handler
const serverErrorHandler = async (error: AxiosError) => {
    // On server side, we usually don't do refresh token logic (it's complex and slows down response).
    // Instead, we let the error propagate so the page can redirect to login or show error.

    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
        const apiError = (responseData as { error: unknown }).error;
        if (apiError && typeof apiError === 'object' && 'code' in apiError && 'message' in apiError) {
            throw new AppError(apiError as AppError);
        }
    }

    throw error
}

export const serverApiClient = createApiClient({
  baseURL: API_BASE_URL,
  tokenProvider: serverTokenProvider,
  errorHandler: serverErrorHandler
})
