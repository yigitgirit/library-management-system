import { LoansManagementView } from "@/features/loans/components/loans-management-view"
import {LoanSearchParams, loanSearchParamsSchema} from "@/features/loans/schemas/loan-search"
import { NextPageSearchParams } from "@/features/common/types/search-params"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"

type LoansManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function LoansManagementPage(props: LoansManagementPageProps) {
  const parsedParams: LoanSearchParams = await parseSearchParams(props.searchParams, loanSearchParamsSchema);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Loan Management" 
        text="Manage active loans, returns, and overdue items." 
      />

      <LoansManagementView initialFilters={parsedParams} />
    </div>
  )
}
