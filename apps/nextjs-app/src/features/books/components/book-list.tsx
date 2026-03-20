"use client"

import {useSuspenseQuery} from "@tanstack/react-query"
import { cn, createBookSlug } from "@/lib/utils"
import { Library, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookPagination } from "@/features/books/components/book-pagination"
import { bookQueries } from "@/features/books/api/bookQueries"
import { Book } from "@/features/books/types/book"
import { useSearchParams } from "next/navigation"
import { BookListSkeleton } from "@/features/books/components/book-skeletons"

export function BookList() {
  const searchParams = useSearchParams()
  
  const search = searchParams.get("search") || undefined
  
  const categoryIdsParam = searchParams.getAll("categoryIds")
  let categoryIds: number[] | undefined = undefined
  if (categoryIdsParam.length > 0) {
    categoryIds = categoryIdsParam.map(Number).filter(n => !isNaN(n))
  }

  const available = searchParams.get("available") === 'true'
  const sort = searchParams.get("sort") || "title,asc"

  const pageParam = Number(searchParams.get("page"))
  const page = pageParam > 0 ? pageParam - 1 : 0

  const sizeParam = Number(searchParams.get("size"))
  const size = [12, 24, 48].includes(sizeParam) ? sizeParam : 12
  
  const colsParam = searchParams.get("cols")
  const cols = colsParam === '2' ? 2 : colsParam === '3' ? 3 : 4

  const { data, isLoading, isError, isFetching } = useSuspenseQuery(bookQueries.list({
    search,
    categoryIds,
    available: available ? true : undefined,
    page,
    size,
    sort: sort ? [sort] : undefined
  }))

  const books = data?.content || []
  const totalPages = data?.page?.totalPages || 0
  const totalElements = data?.page?.totalElements || 0

  const gridClass = cn(
    "grid gap-6",
    cols === 2 && "grid-cols-1 sm:grid-cols-2",
    cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  )

  if (isLoading) {
    return <BookListSkeleton cols={cols} count={size} />
  }

  return (
    <div className="space-y-4 relative min-h-[50vh]">
        {/* Results Count Indicator */}
        <div className="text-sm text-muted-foreground">
            {search ? (
                <>
                    Found <span className="font-medium text-foreground">{totalElements}</span> results for <span className="font-medium text-foreground">&quot;{search}&quot;</span>
                </>
            ) : (
                <>
                    Showing <span className="font-medium text-foreground">{totalElements}</span> books
                </>
            )}
        </div>

        {/* Background Fetching Progress Bar */}
        {!isLoading && isFetching && (
            <div className="absolute inset-x-0 top-3 z-50 h-[2px] bg-primary/20 overflow-hidden rounded-full">
                <div className="h-full bg-primary animate-progress-loading w-1/3" />
            </div>
        )}

        {/* Books Grid */}
        {isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-destructive/10 border-destructive/20">
                <h3 className="text-lg font-semibold text-destructive">Error loading books</h3>
                <p className="text-muted-foreground">Please try again later.</p>
            </div>
        ) : books.length > 0 ? (
            <div className={cn(gridClass, isFetching && "opacity-50 transition-opacity duration-200")}>
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
                <Library className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/books">Clear all filters</Link>
                </Button>
            </div>
        )}

        {/* Pagination */}
        <div className={cn(isFetching && "opacity-50 transition-opacity duration-200")}>
            <BookPagination totalPages={totalPages} />
        </div>
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  const isAvailable = (book.availableCopies || 0) > 0
  const bookSlug = createBookSlug(book.id!, book.title || "book");
  
  const authorNames = book.authors && book.authors.length > 0 
    ? book.authors.map(a => a.name).join(", ") 
    : "Unknown Author";

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-muted/60">
      <Link href={`/books/${bookSlug}`} className="relative aspect-[2/3] w-full bg-muted overflow-hidden block cursor-pointer">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt={book.title || "Book Cover"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/30">
            <BookOpen className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Action Overlay (Desktop) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
           <Button size="sm" variant="secondary" className="w-full shadow-lg font-medium">
             View Details
           </Button>
        </div>
      </Link>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        {/* Top Metadata: Category */}
        <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-normal bg-muted/50 text-xs max-w-full truncate" title={book.category?.name}>
                {book.category?.name || "General"}
            </Badge>
        </div>

        {/* Main Content: Title & Author */}
        <div className="flex flex-col gap-1 flex-1">
            <Link href={`/books/${bookSlug}`} className="font-semibold text-base leading-tight hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]" title={book.title}>
                {book.title}
            </Link>
            <div className="mt-auto pt-1">
                <p className="text-sm text-muted-foreground line-clamp-1" title={authorNames}>
                    {authorNames}
                </p>
            </div>
        </div>

        {/* Bottom Metadata: Status & Year */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40">
            <div className="flex items-center pt-2">
                {isAvailable ? (
                    <span className="text-green-600 font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Available
                    </span>
                ) : (
                    <span className="text-destructive font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        Unavailable
                    </span>
                )}
            </div>
            {book.publishedDate && (
                <span className="pt-2 font-medium text-muted-foreground/80">{new Date(book.publishedDate).getFullYear()}</span>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
