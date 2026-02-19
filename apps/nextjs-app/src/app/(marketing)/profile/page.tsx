import { getCurrentUser } from "@/features/auth/utils"
import { AccessDenied } from "@/features/auth/access-denied"
import { ProfileView } from "@/features/users/components/profile-view"

export default async function MyProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <AccessDenied description="You need to be signed in to view your profile." />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Increased max-width to allow the profile card to expand */}
      <main className="flex-1 container mx-auto max-w-7xl py-10 px-4 md:px-8">
        <ProfileView />
      </main>
    </div>
  )
}
