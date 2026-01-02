"use client"

import React, { useState } from "react"
import { UserPrivateProfile, UserEditProfileRequest } from "@/features/users/types/user"
import { NotificationCategory, NotificationChannel } from "@/features/notification/types/notification-preference"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/features/common/hooks/use-toast"
import { Loader2, Mail, MessageSquare } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/api-client/error-utils"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { userService } from "@/features/users/services/userService"
import { notificationPreferenceQueries, useUpdateNotificationPreference } from "@/features/notification/api/notificationPreferenceQueries"

interface SettingsViewProps {
  initialProfile: UserPrivateProfile
}

export function SettingsView({ initialProfile }: SettingsViewProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [profile, setProfile] = useState<UserPrivateProfile>(initialProfile)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Form states
  const [formData, setFormData] = useState<UserEditProfileRequest>({
    firstName: initialProfile.firstName,
    lastName: initialProfile.lastName,
  })

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: userService.editMyProfile,
    onSuccess: (updatedData) => {
      setProfile(prev => ({
        ...prev,
        ...updatedData
      }))
      setValidationErrors({})
      
      queryClient.invalidateQueries({ queryKey: ['my-profile'] })
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    },
    onError: (error: unknown) => {
      const parsedError = handleApiError(error)
      
      if (parsedError.validationErrors) {
        setValidationErrors(parsedError.validationErrors)
      }

      toast({
        title: "Error",
        description: parsedError.message,
        variant: "destructive",
      })
    }
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors({})
    updateProfileMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof UserEditProfileRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
        setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
    }
  }

  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar / User Info */}
      <aside className="md:w-1/3 lg:w-1/4 space-y-6">
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative h-24 w-24">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="/avatars/01.png" alt={profile.firstName} />
                        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Role:</span>
                        <span className="font-medium text-foreground">{profile.roles?.join(", ") || "N/A"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </aside>

      {/* Main Content / Forms */}
      <div className="flex-1">
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className={validationErrors.firstName ? "text-destructive" : ""}>
                                        First Name
                                    </Label>
                                    <Input 
                                        id="firstName" 
                                        value={formData.firstName || ""} 
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        className={validationErrors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {validationErrors.firstName && (
                                        <p className="text-sm text-destructive">{validationErrors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className={validationErrors.lastName ? "text-destructive" : ""}>
                                        Last Name
                                    </Label>
                                    <Input 
                                        id="lastName" 
                                        value={formData.lastName || ""} 
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        className={validationErrors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {validationErrors.lastName && (
                                        <p className="text-sm text-destructive">{validationErrors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={profile.email} disabled className="bg-muted" />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={updateProfileMutation.isPending}>
                                {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>

            <TabsContent value="notifications">
                <NotificationSettings />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NotificationSettings() {
    const { toast } = useToast()
    const { data: preferences, isLoading } = useQuery(notificationPreferenceQueries.list())
    const updatePreferenceMutation = useUpdateNotificationPreference()

    const handleToggle = (category: NotificationCategory, channel: NotificationChannel, isChecked: boolean) => {
        const currentPref = preferences?.find(p => p.category === category)
        const currentChannels = currentPref?.channels || []
        
        let newChannels: NotificationChannel[]
        if (isChecked) {
            newChannels = [...currentChannels, channel]
        } else {
            newChannels = currentChannels.filter(c => c !== channel)
        }

        updatePreferenceMutation.mutate({
            category,
            channels: newChannels
        }, {
            onSuccess: () => {
                toast({
                    title: "Preferences updated",
                    description: "Your notification settings have been saved.",
                })
            },
            onError: (error: unknown) => {
                const { message } = handleApiError(error)
                toast({
                    title: "Error",
                    description: message,
                    variant: "destructive",
                })
            }
        })
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Loading settings...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    const categories = [
        { id: NotificationCategory.LOAN_OVERDUE, label: "Loan Overdue", description: "Get notified when a loan is overdue." },
        { id: NotificationCategory.LOAN_DUE_SOON, label: "Loan Due Soon", description: "Get notified before a loan is due." },
        { id: NotificationCategory.FINE_ISSUED, label: "Fine Issued", description: "Get notified when a fine is issued." },
        { id: NotificationCategory.FINE_PAID, label: "Fine Paid", description: "Get notified when a fine payment is processed." },
        { id: NotificationCategory.GENERAL_ANNOUNCEMENT, label: "General Announcements", description: "News and updates from the library." },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {categories.map((category) => {
                    const pref = preferences?.find(p => p.category === category.id)
                    const channels = pref?.channels || []

                    return (
                        <div key={category.id} className="flex items-start justify-between space-x-4 rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">{category.label}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {category.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Switch 
                                        checked={channels.includes(NotificationChannel.EMAIL)}
                                        onCheckedChange={(checked) => handleToggle(category.id, NotificationChannel.EMAIL, checked)}
                                        disabled={updatePreferenceMutation.isPending}
                                    />
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3" /> Email
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Switch 
                                        checked={channels.includes(NotificationChannel.SMS)}
                                        onCheckedChange={(checked) => handleToggle(category.id, NotificationChannel.SMS, checked)}
                                        disabled={updatePreferenceMutation.isPending}
                                    />
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MessageSquare className="h-3 w-3" /> SMS
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
