import { LoansManagementView } from "@/features/loans/components/loans-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function LoansManagementPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Loan Management</h2>
          <p className="text-muted-foreground">
            Manage active loans, returns, and overdue items.
          </p>
        </div>
      </div>

      <LoansManagementView />
    </div>
  )
}
