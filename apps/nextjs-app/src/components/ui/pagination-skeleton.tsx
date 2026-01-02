import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface PaginationSkeletonProps {
  className?: string
}

export function PaginationSkeleton({ className }: PaginationSkeletonProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 px-2 py-4 w-full", className)}>
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First/Prev Buttons */}
        <Skeleton className="h-9 w-9 rounded-md hidden lg:block" /> {/* First */}
        <Skeleton className="h-9 w-24 rounded-md" /> {/* Previous (Text + Icon) */}
        
        {/* Page Numbers (Sliding Window) */}
        <div className="flex items-center gap-1 mx-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>

        {/* Next/Last Buttons */}
        <Skeleton className="h-9 w-24 rounded-md" /> {/* Next (Text + Icon) */}
        <Skeleton className="h-9 w-9 rounded-md hidden lg:block" /> {/* Last */}
      </div>

      {/* Page Metadata */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}
