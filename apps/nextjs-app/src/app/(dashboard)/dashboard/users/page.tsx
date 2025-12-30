import { UsersView } from "@/features/users/components/users-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function UsersPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  if (!user.roles?.includes(ROLES.ADMIN)) {
      redirect("/dashboard"); // Or 403 page
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions.
          </p>
        </div>
      </div>

      <UsersView />
    </div>
  )
}
