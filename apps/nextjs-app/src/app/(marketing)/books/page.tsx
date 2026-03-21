import {Suspense} from "react"
import {dehydrate, HydrationBoundary} from "@tanstack/react-query"
import {Skeleton} from "@/components/ui/skeleton"
import {BookFilters} from "@/features/books/components/book-filters"
import {BookList} from "@/features/books/components/book-list"
import {bookQueries} from "@/features/books/api/bookQueries"
import {BookSearchParams} from "@/features/books/types/book"
import {categoryQueries} from "@/features/categories/api/categoryQueries"
import {FiltersSkeleton} from "@/features/books/components/book-skeletons"
import {getQueryClient} from "@/lib/query-client"
import {DesktopToolbar} from "@/features/books/components/desktop-toolbar"
import {MobileToolbar} from "@/features/books/components/mobile-toolbar"

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage(props: CatalogPageProps) {
    const searchParams = await props.searchParams;

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
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

                <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar (Desktop) */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <Suspense fallback={<FiltersSkeleton />}>
                                <BookFilters />
                            </Suspense>
                        </aside>

                        <div className="flex-1 space-y-4 sm:space-y-6">
                            {/* Sticky Toolbar */}
                            <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                                <div className="sticky top-14 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 sm:py-2 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-b sm:border-b-0 border-border sm:shadow-none shadow-sm mb-4 sm:mb-6">
                                    <div className="hidden sm:block">
                                        <DesktopToolbar searchKey={search} />
                                    </div>
                                    <div className="sm:hidden">
                                        <MobileToolbar searchKey={search} />
                                    </div>
                                </div>
                            </Suspense>

                            <BookList />
                        </div>
                    </div>
                </div>
                </HydrationBoundary>
            </main>
        </div>
    )
}
