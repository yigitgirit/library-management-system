import { Skeleton } from "@/components/ui/skeleton"
import { FiltersSkeleton, BookListSkeleton } from "@/features/books/components/book-skeletons"

export default function BooksLoading() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8">
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Skeleton */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <FiltersSkeleton />
                        </aside>

                        <div className="flex-1 space-y-6">
                            {/* Toolbar Skeleton */}
                            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-background/95 backdrop-blur sticky top-14 z-10 py-2 -my-2">
                                <Skeleton className="h-10 w-full sm:max-w-sm" />
                                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                                    <Skeleton className="h-9 w-24 lg:hidden" /> {/* Mobile filter trigger */}
                                    <Skeleton className="h-9 w-[180px]" />
                                    <div className="hidden sm:block w-px h-6 bg-border mx-1" />
                                    <Skeleton className="h-9 w-[150px]" />
                                </div>
                            </div>

                            {/* List Skeleton */}
                            <BookListSkeleton />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}