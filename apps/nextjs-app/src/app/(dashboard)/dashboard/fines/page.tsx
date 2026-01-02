import { FinesManagementView } from "@/features/fines/components/fines-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants"
import { fineSearchParamsSchema } from "@/features/fines/schemas/fine-search"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"
import { NextPageSearchParams } from "@/features/common/types/search-params"

type FinesManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function FinesManagementPage(props: FinesManagementPageProps) {
  const parsedParams = await parseSearchParams(props.searchParams, fineSearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Fine Management" 
        text="Track and manage user fines." 
      />

      <FinesManagementView initialFilters={parsedParams} />
    </div>
  )
}
