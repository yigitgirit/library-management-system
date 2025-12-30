import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/common/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/features/common/components/ui/avatar"
import { UserPublicProfile } from "@/features/users/services/types"
import { getCurrentUser } from "@/features/auth/utils"
import { AccessDenied } from "@/features/auth/access-denied"
import { cookies } from "next/headers"
import { Button } from "@/features/common/components/ui/button"
import Link from "next/link"
import { UserX } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getPublicProfile(id: string, token: string): Promise<UserPublicProfile | null> {
  try {
    console.log(`Fetching public profile for ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.error(`Failed to fetch public profile: ${response.status} ${response.statusText}`);
      if (response.status === 404) {
          return null;
      }
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}

interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return <AccessDenied description="You need to be signed in to view user profiles." />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
      return <AccessDenied description="Session expired. Please sign in again." />;
  }

  const { id } = await params
  const profile = await getPublicProfile(id, token);

  if (!profile) {
    return (
        <div className="flex items-center justify-center min-h-[50vh] px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 bg-muted p-4 rounded-full">
                        <UserX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl">User Not Found</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        The user profile you are looking for does not exist or you don&#39;t have permission to view it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1 container mx-auto max-w-3xl py-12 px-4 md:px-8">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto mb-6 relative h-32 w-32">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src="/avatars/01.png" alt={profile.firstName} />
                        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-3xl">{profile.firstName} {profile.lastName}</CardTitle>
                <CardDescription>Library Member</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground">
                    <p>This is a public profile view.</p>
                    {/* Add more public info here if available (e.g. favorite books, public lists) */}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
