import { Suspense } from "react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter } from "lucide-react"
import { BookFilters } from "@/features/books/components/book-filters"
import { BookSort } from "@/features/books/components/book-sort"
import { BookSearch } from "@/features/books/components/book-search"
import { BookViewOptions } from "@/features/books/components/book-view-options"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookList } from "@/features/books/components/book-list"
import { bookQueries } from "@/features/books/api/bookQueries"
import { BookSearchParams } from "@/features/books/types/book"
import { categoryQueries } from "@/features/categories/api/categoryQueries"
import { BookListSkeleton, FiltersSkeleton } from "@/features/books/components/book-skeletons"
import { getQueryClient } from "@/lib/query-client"

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage(props: CatalogPageProps) {
    const searchParams = await props.searchParams;

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const cols = Number(searchParams.cols) || 4;
    const size = Number(searchParams.size) || 12;

    const queryClient = getQueryClient()

    const apiParams: BookSearchParams = {
        search,
        page: Number(searchParams.page) || 0,
        size,
        sort: typeof searchParams.sort === 'string' ? [searchParams.sort] : Array.isArray(searchParams.sort) ? searchParams.sort : undefined,
        categoryIds: searchParams.categoryIds 
            ? (Array.isArray(searchParams.categoryIds) ? searchParams.categoryIds.map(Number) : [Number(searchParams.categoryIds)])
            : undefined,
        available: searchParams.available === 'true',
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    }

    await Promise.all([
        queryClient.prefetchQuery(bookQueries.list(apiParams)),
        queryClient.prefetchQuery(categoryQueries.list({ page: 0, size: 30 }))
    ])

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

                            {/* 3. Hydration Boundary passes server data to client cache */}
                            <Suspense
                                fallback={<BookListSkeleton cols={cols} count={size} />}
                            >
                                <HydrationBoundary state={dehydrate(queryClient)}>
                                    <BookList />
                                </HydrationBoundary>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
