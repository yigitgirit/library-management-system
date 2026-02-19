import { getCurrentUser } from "@/features/auth/utils"
import { AccessDenied } from "@/features/auth/access-denied"
import { PublicProfileView } from "@/features/users/components/public-profile-view"

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

  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      {/* Increased max-width to allow the profile card to expand */}
      <main className="flex-1 container mx-auto max-w-7xl py-10 px-4 md:px-8">
        <PublicProfileView userId={Number(id)} />
      </main>
    </div>
  )
}
