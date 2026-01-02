import { UsersView } from "@/features/users/components/users-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants"
import { userSearchParamsSchema } from "@/features/users/schemas/user-search"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"
import { NextPageSearchParams } from "@/features/common/types/search-params"

type UsersPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function UsersPage(props: UsersPageProps) {
    const parsedParams = await parseSearchParams(props.searchParams, userSearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Users" 
        text="Manage system users, roles, and permissions." 
      />

      <UsersView initialFilters={parsedParams} />
    </div>
  )
}
