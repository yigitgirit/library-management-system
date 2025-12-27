import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter } from "lucide-react"
import { BookFilters } from "@/components/books/book-filters"
import { BookSort } from "@/components/books/book-sort"
import { BookSearch } from "@/components/books/book-search"
import { BookViewOptions } from "@/components/books/book-view-options"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookList } from "./book-list"

export const dynamic = 'force-dynamic'

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage(props: CatalogPageProps) {
    const searchParams = await props.searchParams;

    // 1. Extract view preferences for the skeleton
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const cols = Number(searchParams.cols) || 4;
    const size = Number(searchParams.size) || 12;

    // 2. The unique key for the list
    const filterKey = JSON.stringify(searchParams);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8">
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar (Desktop) */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <Suspense fallback={<FiltersSkeleton />}>
                                <BookFilters />
                            </Suspense>
                        </aside>

                        <div className="flex-1 space-y-6">
                            {/* Sticky Toolbar */}
                            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-background/95 backdrop-blur sticky top-14 z-10 py-2 -my-2">
                                <Suspense fallback={<Skeleton className="h-10 w-full sm:max-w-sm" />}>
                                    <BookSearch key={search} />
                                </Suspense>

                                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                                    {/* Mobile Filter Drawer */}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="lg:hidden h-9">
                                                <Filter className="mr-2 h-4 w-4" /> Filters
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-[300px]">
                                            <div className="py-4">
                                                <Suspense fallback={<FiltersSkeleton />}>
                                                    <BookFilters />
                                                </Suspense>
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                    <Suspense fallback={<Skeleton className="h-9 w-[180px]" />}>
                                        <BookSort />
                                    </Suspense>

                                    <div className="hidden sm:block w-px h-6 bg-border mx-1" />

                                    <Suspense fallback={<Skeleton className="h-9 w-[150px]" />}>
                                        <BookViewOptions />
                                    </Suspense>
                                </div>
                            </div>

                            {/* 3. The Refined Async List with Prop Sync */}
                            <Suspense
                                key={filterKey}
                                fallback={<BookListSkeleton cols={cols} count={size} />}
                            >
                                <BookList searchParams={searchParams} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

// --- Skeletons ---

function FiltersSkeleton() {
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

function BookListSkeleton({ cols = 4, count = 8 }: { cols?: number, count?: number }) {
    const gridClass = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }[cols as 2 | 3 | 4] || "grid-cols-4";

    return (
        <div className="space-y-6">
            {/* Sync with Results Count Indicator */}
            <Skeleton className="h-5 w-48" />

            <div className={`grid gap-6 ${gridClass}`}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full overflow-hidden border rounded-lg bg-card">
                        {/* 4. Aspect Ratio Lock */}
                        <Skeleton className="aspect-[2/3] w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                            <Skeleton className="h-9 w-full mt-2" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Skeleton */}
            <Skeleton className="h-10 w-full mt-8" />
        </div>
    )
}
