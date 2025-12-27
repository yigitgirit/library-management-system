import { BooksManagementView } from "@/components/dashboard/books/books-management-view"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/lib/constants"

export default async function BooksManagementPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Book Management</h2>
          <p className="text-muted-foreground">
            Manage library inventory, add new books, and update details.
          </p>
        </div>
      </div>

      <BooksManagementView />
    </div>
  )
}
