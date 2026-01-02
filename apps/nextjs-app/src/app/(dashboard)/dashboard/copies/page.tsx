import { CopiesManagementView } from "@/features/copies/components/copies-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants"
import { copySearchParamsSchema } from "@/features/copies/schemas/copy-search"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"
import { NextPageSearchParams } from "@/features/common/types/search-params"

type CopiesManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function CopiesManagementPage(props: CopiesManagementPageProps) {
    const parsedParams = await parseSearchParams(props.searchParams, copySearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Copy Management" 
        text="Manage physical book copies, barcodes, and status." 
      />

      <CopiesManagementView initialFilters={parsedParams} />
    </div>
  )
}
