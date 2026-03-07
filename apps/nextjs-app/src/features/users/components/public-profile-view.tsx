import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UserX, BookOpen, Award, Calendar } from "lucide-react"
import { userService } from "@/features/users/services/userService"

interface PublicProfileViewProps {
    userId: number
}

export async function PublicProfileView({ userId }: PublicProfileViewProps) {
    try {
        const profile = await userService.getUserPublicProfile(userId)
        
        const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase()

        return (
            <div className="w-full max-w-5xl mx-auto">
                <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                        <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" />
                    </div>

                    <CardHeader className="relative px-8 pb-0">
                        <div className="-mt-20 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <Avatar className="h-40 w-40 border-[6px] border-background shadow-xl ring-1 ring-border/10">
                                <AvatarImage src="avatar.svg" alt={profile.firstName} className="object-cover" />
                                <AvatarFallback className="text-5xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className="mt-4 text-center md:text-left md:mb-4 flex-1 min-w-0 space-y-2">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground truncate">
                                    {profile.firstName} {profile.lastName}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge variant="secondary" className="px-3 py-1 text-sm font-medium shadow-sm">
                                        Library Member
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 py-10 space-y-10">
                        {/* Stats Grid */}
                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors text-center space-y-3">
                                <div className="p-3 rounded-full bg-background shadow-sm text-primary">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold tracking-tight">0</p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Books Read</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors text-center space-y-3">
                                <div className="p-3 rounded-full bg-background shadow-sm text-primary">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold tracking-tight">Newbie</p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Rank</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors text-center space-y-3">
                                <div className="p-3 rounded-full bg-background shadow-sm text-primary">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold tracking-tight">2024</p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Joined</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center py-8 border-t">
                            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                                This user hasn&#39;t written a bio yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    } catch (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader>
                        <div className="mx-auto mb-6 bg-muted p-4 rounded-full">
                            <UserX className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">User Not Found</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            The user profile you are looking for does not exist or you don&#39;t have permission to view it.
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