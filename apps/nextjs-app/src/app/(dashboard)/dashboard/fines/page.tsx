import { FinesManagementView } from "@/features/fines/components/fines-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function FinesManagementPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Only ADMIN can manage fines (based on backend controller)
  if (!user.roles?.includes(ROLES.ADMIN)) {
      redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fine Management</h2>
          <p className="text-muted-foreground">
            Track and manage user fines.
          </p>
        </div>
      </div>

      <FinesManagementView />
    </div>
  )
}
