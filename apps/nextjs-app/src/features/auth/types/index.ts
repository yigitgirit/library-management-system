import { UserDto } from '@/lib/api'

export interface AuthState {
  user: UserDto | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: UserDto | null) => void
  setIsLoading: (isLoading: boolean) => void
  logout: () => void
}
