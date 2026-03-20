import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BookLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content Container */}
      <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8 lg:py-12">
        {/* Breadcrumb / Back Link Skeleton */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="pl-0 hover:bg-transparent hover:text-primary -ml-2"
            disabled
          >
            <div className="flex items-center gap-2 text-muted-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </div>
          </Button>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
          {/* Left Column Skeleton */}
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          {/* Right Column Skeleton */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <Separator />
            
            {/* Description Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Details Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl p-6 bg-card shadow-sm">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Section Skeleton */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
