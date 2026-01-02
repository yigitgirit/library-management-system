import { LoansView } from "@/features/loans/components/loans-view"

export default function LoansPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/5">
      <main className="flex-1 container mx-auto max-w-5xl py-10 px-4 md:px-8">
        <LoansView />
      </main>
    </div>
  )
}
