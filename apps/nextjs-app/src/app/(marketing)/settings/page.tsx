import { SettingsView } from "@/features/users/components/settings-view"
import { getCurrentUser } from "@/features/auth/utils"
import { cookies } from "next/headers"
import { UserPrivateProfile } from "@/features/users/types/user"
import { AccessDenied } from "@/features/auth/access-denied"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getProfile(token: string): Promise<UserPrivateProfile | null> {
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

export default async function SettingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <AccessDenied description="You need to be signed in to access settings." />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return <AccessDenied description="Session expired. Please sign in again." />;
  }

  const profile = await getProfile(token);

  if (!profile) {
      return <AccessDenied description="Unable to load settings. Please try again later." />;
  }

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

            <SettingsView initialProfile={profile} />

        </div>
      </main>
    </div>
  )
}
