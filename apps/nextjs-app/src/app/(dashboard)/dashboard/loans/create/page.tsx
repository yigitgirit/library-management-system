import { CreateLoanView } from "@/features/loans/components/create-loan-view"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"

export default function CreateLoanPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Create Loan" 
        text="Issue a book copy to a user." 
      />

      <CreateLoanView />
    </div>
  )
}
