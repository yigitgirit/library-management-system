export const API_CONFIG = {
  // Server-side calls in Docker use INTERNAL_API_URL (http://backend:8080)
  // Client-side calls or Local Dev use NEXT_PUBLIC_API_URL (http://localhost:8080)
  BASE_URL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;