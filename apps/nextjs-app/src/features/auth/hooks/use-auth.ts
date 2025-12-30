"use client"

import { useAuthStore } from "@/features/auth/store"

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  return { user, isAuthenticated, isLoading }
}
