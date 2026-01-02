import { useAuthStore } from "../store"

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}