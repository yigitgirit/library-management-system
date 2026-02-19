"use client"

import { useQuery } from "@tanstack/react-query"
import { SettingsView } from "@/features/users/components/settings-view"
import { userQueries } from "@/features/users/api/userQueries"
import { AccessDenied } from "@/features/auth/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsPage() {
  const { data: profile, isLoading, isError } = useQuery(userQueries.profile())

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto max-w-5xl py-8 px-4 md:px-8">
        <div className="flex flex-col space-y-8">
            
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            {(() => {
              if (isLoading) {
                return (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/5" />
                      <Skeleton className="h-10 w-full max-w-sm" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/5" />
                      <Skeleton className="h-10 w-full max-w-sm" />
                    </div>
                  </div>
                )
              }

              if (isError || !profile) {
                return <AccessDenied description="Unable to load settings. Please try again later." />
              }

              return <SettingsView initialProfile={profile} />
            })()}

        </div>
      </main>
    </div>
  )
}
