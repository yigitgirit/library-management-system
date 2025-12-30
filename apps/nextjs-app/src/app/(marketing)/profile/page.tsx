import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/common/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/features/common/components/ui/avatar"
import { Button } from "@/features/common/components/ui/button"
import { getCurrentUser } from "@/features/auth/utils"
import { cookies } from "next/headers"
import { UserPrivateProfile } from "@/features/users/services/types"
import Link from "next/link"
import { Settings } from "lucide-react"
import { AccessDenied } from "@/features/auth/access-denied"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getMyProfile(token: string): Promise<UserPrivateProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export default async function MyProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <AccessDenied description="You need to be signed in to view your profile." />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return <AccessDenied description="Session expired. Please sign in again." />;
  }

  const profile = await getMyProfile(token);

  if (!profile) {
      return <AccessDenied description="Unable to load profile. Please try again later." />;
  }

  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1 container mx-auto max-w-3xl py-12 px-4 md:px-8">
        <Card className="text-center relative">
            <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/settings">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Edit Profile</span>
                    </Link>
                </Button>
            </div>
            <CardHeader>
                <div className="mx-auto mb-6 relative h-32 w-32">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src="/avatars/01.png" alt={profile.firstName} />
                        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-3xl">{profile.firstName} {profile.lastName}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 text-muted-foreground">
                    <div className="flex justify-center gap-2">
                        <span className="font-medium text-foreground">Role:</span>
                        <span>{profile.roles.join(", ")}</span>
                    </div>
                    {/* Add more stats here like "Books Read", "Current Loans" etc. */}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
