import { CategoriesManagementView } from "@/features/categories/components/categories-management-view"
import { getCurrentUser } from "@/features/auth/utils"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants"
import { categorySearchParamsSchema } from "@/features/categories/schemas/category-search"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"
import { NextPageSearchParams } from "@/features/common/types/search-params"

type CategoriesManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function CategoriesManagementPage(props: CategoriesManagementPageProps) {
    const parsedParams = await parseSearchParams(props.searchParams, categorySearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Category Management" 
        text="Manage book categories." 
      />

      <CategoriesManagementView initialFilters={parsedParams} />
    </div>
  )
}
