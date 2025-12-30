"use client"

import React, { useEffect, useRef } from "react"
import { useAuthStore } from "@/features/auth/store"
import { UserControllerService, UserDto } from "@/lib/api"
import { OpenAPI } from "@/lib/api/core/OpenAPI"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useApiQuery } from "@/lib/api-client/api-hooks"
import { setupAxiosInterceptors } from "@/lib/api-client/axios-interceptor"

// Set base URL immediately
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface AuthProviderProps {
  children: React.ReactNode
  accessToken?: string
}

export function AuthProvider({ children, accessToken }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)
  const router = useRouter()
  
  // Initialize loading state based on token presence immediately
  // This prevents flickering of "Loading" state when we know there is no token
  const initialized = useRef(false)
  if (!initialized.current) {
      useAuthStore.setState({ isLoading: !!accessToken, isAuthenticated: !!accessToken })
      initialized.current = true
  }

  // Setup Axios Interceptors once on mount
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  // Wrapper function to set token just before the API call
  const fetchProfile = () => {
    if (accessToken) {
      OpenAPI.TOKEN = accessToken;
    }
    return UserControllerService.getMyProfile();
  };

  // Use React Query to fetch the profile
  const { data: userProfile, isError, isLoading: isQueryLoading } = useApiQuery(
    ['my-profile', accessToken], // Add accessToken to the query key
    fetchProfile,
    [],
    {
      enabled: !!accessToken, // Only fetch if token exists
      retry: false, // Don't retry if 401/403
      staleTime: 1000 * 60 * 5, // Cache profile for 5 minutes
    }
  )

  useEffect(() => {
    if (!accessToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    if (userProfile?.data) {
      setUser(userProfile.data as unknown as UserDto)
      setIsLoading(false)
    } else if (isError) {
      setUser(null)
      setIsLoading(false)
      // If fetch fails (likely 401), logout
      logoutAction().then(() => router.refresh())
    } else if (!isQueryLoading) {
        // Case where query finished but no data (shouldn't happen with successful response)
        // or initial state
    }

    // Sync loading state
    setIsLoading(isQueryLoading)

  }, [accessToken, userProfile, isError, isQueryLoading, setUser, setIsLoading, router])

  return <>{children}</>
}
