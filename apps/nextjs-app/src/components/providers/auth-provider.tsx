"use client"

import React, { useEffect, useRef } from "react"
import { useAuthStore } from "@/features/auth/store"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import {useQuery} from "@tanstack/react-query";
import { userService } from "@/features/users/services/userService"
import { apiClient } from "@/lib/api-client"
import { User } from "@/features/users/types/user"

interface AuthProviderProps {
  children: React.ReactNode
  accessToken?: string
}

export function AuthProvider({ children, accessToken }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)
  const router = useRouter()

  const initialized = useRef(false)
  if (!initialized.current) {
      useAuthStore.setState({ isLoading: !!accessToken, isAuthenticated: !!accessToken })
      initialized.current = true
  }

  const fetchProfile = () => {
    if (accessToken) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    return userService.getMyProfile();
  };

  const { data: userProfile, isError, isLoading: isQueryLoading } = useQuery({
    queryKey: ['my-profile', accessToken],
    queryFn: fetchProfile,
    enabled: !!accessToken,
    retry: false,
    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    if (!accessToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    if (userProfile) {
      setUser(userProfile as unknown as User)
      setIsLoading(false)
    } else if (isError) {
      setUser(null)
      setIsLoading(false)
      logoutAction().then(() => router.refresh())
    } else if (!isQueryLoading) {
    }

    setIsLoading(isQueryLoading)

  }, [accessToken, userProfile, isError, isQueryLoading, setUser, setIsLoading, router])

  return <>{children}</>
}
