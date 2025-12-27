import { CategoriesManagementView } from "@/components/dashboard/categories/categories-management-view"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function CategoriesManagementPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground">
            Manage book categories.
          </p>
        </div>
      </div>

      <CategoriesManagementView />
    </div>
  )
}
