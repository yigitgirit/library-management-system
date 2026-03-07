import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Settings, Mail, Shield, CalendarDays, UserX } from "lucide-react"
import { userService } from "@/features/users/services/userService"

export async function ProfileView() {
    try {
        const user = await userService.getMyProfile()
        
        const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
        
        const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        }) : 'Member since 2024'

        return (
            <div className="w-full max-w-5xl mx-auto">
                <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-background relative">
                        <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" />
                        <div className="absolute top-6 right-6">
                            <Button variant="secondary" size="sm" className="gap-2 shadow-sm" asChild>
                                <Link href="/settings">
                                    <Settings className="h-4 w-4" />
                                    <span className="hidden sm:inline">Edit Profile</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <CardHeader className="relative px-8 pb-0">
                        <div className="-mt-20 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <Avatar className="h-40 w-40 border-[6px] border-background shadow-xl ring-1 ring-border/10">
                                <AvatarImage src="avatar.svg" alt={user.firstName} className="object-cover" />
                                <AvatarFallback className="text-5xl bg-primary/10 text-primary font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className="mt-4 text-center md:text-left md:mb-4 flex-1 min-w-0 space-y-2">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground truncate">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {user.roles.map((role) => (
                                        <Badge key={role} variant="secondary" className="px-3 py-1 text-sm font-medium shadow-sm">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 py-10 space-y-10">
                        {/* User Details Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/40 border hover:bg-muted/60 transition-colors">
                                <div className="p-3 rounded-full bg-background border shadow-sm text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                    <p className="text-base font-semibold truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/40 border hover:bg-muted/60 transition-colors">
                                <div className="p-3 rounded-full bg-background border shadow-sm text-primary">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                                    <p className="text-base font-semibold capitalize">
                                        {user.roles.includes('ADMIN') ? 'Administrator' : 'Library Member'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/40 border hover:bg-muted/60 transition-colors">
                                <div className="p-3 rounded-full bg-background border shadow-sm text-primary">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                    <p className="text-base font-semibold">{joinDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold tracking-tight border-b pb-2">Activity Overview</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors">
                                    <span className="text-4xl font-bold text-primary mb-1">0</span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Books Read</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors">
                                    <span className="text-4xl font-bold text-primary mb-1">0</span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Loans</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors">
                                    <span className="text-4xl font-bold text-primary mb-1">0</span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reviews</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors">
                                    <span className="text-4xl font-bold text-primary mb-1">0</span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Points</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    } catch (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <Card className="w-full max-w-md text-center shadow-lg border-destructive/20">
                    <CardHeader>
                        <div className="mx-auto mb-6 bg-destructive/10 p-4 rounded-full">
                            <UserX className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Profile Unavailable</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            We couldn&#39;t load your profile information. Please try again later.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/">Return Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
}