import { ReviewsManagementView } from "@/features/reviews/components/dashboard/reviews-management-view"
import { reviewSearchParamsSchema } from "@/features/reviews/schemas/review"
import { NextPageSearchParams } from "@/features/common/types/search-params"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"

type ReviewsManagementPageProps = {
  searchParams: Promise<NextPageSearchParams>
}

export default async function ReviewsManagementPage(props: ReviewsManagementPageProps) {
  const parsedParams = await parseSearchParams(props.searchParams, reviewSearchParamsSchema)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        heading="Review Management"
        text="Manage and moderate book reviews from users."
      />

      <ReviewsManagementView initialFilters={parsedParams} />
    </div>
  )
}

