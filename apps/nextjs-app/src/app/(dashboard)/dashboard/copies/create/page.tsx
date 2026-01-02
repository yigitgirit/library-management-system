import { CreateCopyView } from "@/features/copies/components/create-copy-view"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"

export default function CreateCopyPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader 
        heading="Add Copy" 
        text="Add a new physical copy of a book to the library." 
      />

      <CreateCopyView />
    </div>
  )
}
