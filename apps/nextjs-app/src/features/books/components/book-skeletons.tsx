import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { PaginationSkeleton } from "@/components/ui/pagination-skeleton"

export function FiltersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between h-8">
                <Skeleton className="h-6 w-16" />
            </div>
            <div className="h-px bg-muted" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="h-px bg-muted" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function BookListSkeleton({ cols = 4, count = 8 }: { cols?: number, count?: number }) {
    const gridClass = cn(
        "grid gap-6",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    )

    return (
        <div className="space-y-6 min-h-[50vh]">
            {/* Sync with Results Count Indicator */}
            <Skeleton className="h-5 w-48" />

            <div className={gridClass}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full overflow-hidden border rounded-lg bg-card">
                        {/* Cover Image */}
                        <Skeleton className="aspect-[2/3] w-full rounded-none" />
                        
                        <div className="p-4 flex-1 flex flex-col gap-3">
                            {/* Top Metadata: Category */}
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>

                            {/* Main Content: Title & Author */}
                            <div className="flex flex-col gap-1 flex-1">
                                {/* Enforce min-height on title skeleton to match real card */}
                                <Skeleton className="h-6 w-full min-h-[2.5rem]" />
                                <div className="mt-auto pt-1">
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>

                            {/* Bottom Metadata: Status & Year */}
                            <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/40">
                                <div className="flex items-center pt-2 gap-1.5">
                                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-4 w-10 mt-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination Skeleton */}
            <PaginationSkeleton className="mt-8 pt-4 border-t" />
        </div>
    )
}