import { AuthorsManagementView } from "@/features/authors/components/authors-management-view"
import { authorSearchParamsSchema } from "@/features/authors/schemas/author-search"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"
import { NextPageSearchParams } from "@/features/common/types/search-params"

type AuthorsManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function AuthorsManagementPage(props: AuthorsManagementPageProps) {
    const parsedParams = await parseSearchParams(props.searchParams, authorSearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Author Management" 
        text="Manage authors and their details." 
      />

      <AuthorsManagementView initialFilters={parsedParams} />
    </div>
  )
}
