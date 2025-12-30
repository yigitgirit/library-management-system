import { AuthorsManagementView } from "@/features/authors/components/authors-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function AuthorsManagementPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  if (!user.roles?.includes(ROLES.ADMIN)) {
      redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Author Management</h2>
          <p className="text-muted-foreground">
            Manage authors and their details.
          </p>
        </div>
      </div>

      <AuthorsManagementView />
    </div>
  )
}
