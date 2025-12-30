import { CopiesManagementView } from "@/features/copies/components/copies-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function CopiesManagementPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  if (!user.roles?.some(role => role === ROLES.ADMIN || role === ROLES.LIBRARIAN)) {
      redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Copy Management</h2>
          <p className="text-muted-foreground">
            Manage physical book copies, barcodes, and status.
          </p>
        </div>
      </div>

      <CopiesManagementView />
    </div>
  )
}
