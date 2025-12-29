import { BookControllerService } from "@/lib/api"
import { BookDto } from "@/lib/api"
import { cn, createBookSlug } from "@/lib/utils"
import { Library, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookPagination } from "@/features/books/book-pagination"

interface BookListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function BookList({ searchParams }: BookListProps) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  let categoryIds: number[] | undefined = undefined
  if (searchParams.categoryIds) {
    const rawIds = Array.isArray(searchParams.categoryIds) 
      ? searchParams.categoryIds 
      : [searchParams.categoryIds]
    categoryIds = rawIds.map(Number).filter(n => !isNaN(n))
  }

  const available = searchParams.available === 'true'
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : "title,asc"

  const pageParam = Number(searchParams.page)
  const page = pageParam > 0 ? pageParam - 1 : 0

  const sizeParam = Number(searchParams.size)
  const size = [12, 24, 48].includes(sizeParam) ? sizeParam : 12
  
  const colsParam = searchParams.cols
  const cols = colsParam === '2' ? 2 : colsParam === '3' ? 3 : 4

  let books: BookDto[] = []
  let totalPages = 0
  let totalElements = 0
  let error = null

  try {
    const response = await BookControllerService.getAllBooks(
        {
            search: search,
            categoryIds: categoryIds,
            available: available ? true : undefined,
            page: page,
            size: size,
            sort: sort ? [sort] : undefined
        })
    books = response.data?.content || []
    totalPages = response.data?.page?.totalPages || 0
    totalElements = response.data?.page?.totalElements || 0
  } catch (e) {
    console.error("Failed to fetch books:", e)
    error = e
  }

  const gridClass = cn(
    "grid gap-6",
    cols === 2 && "grid-cols-1 sm:grid-cols-2",
    cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  )

  return (
    <div className="space-y-6">
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

        {/* Books Grid */}
        {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-destructive/10 border-destructive/20">
                <h3 className="text-lg font-semibold text-destructive">Error loading books</h3>
                <p className="text-muted-foreground">Please try again later.</p>
            </div>
        ) : books.length > 0 ? (
            <div className={gridClass}>
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
        <BookPagination totalPages={totalPages} />
    </div>
  )
}

function BookCard({ book }: { book: BookDto }) {
  const isAvailable = (book.availableCopies || 0) > 0
  const bookSlug = createBookSlug(book.id!, book.title || "book");

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/books/${bookSlug}`} className="relative aspect-[2/3] w-full bg-muted overflow-hidden block cursor-pointer">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt={book.title || "Book Cover"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
            {isAvailable ? (
                <Badge variant="secondary" className="bg-green-500/90 text-white hover:bg-green-600/90 backdrop-blur-sm shadow-sm">
                    In Stock
                </Badge>
            ) : (
                <Badge variant="destructive" className="opacity-90 backdrop-blur-sm shadow-sm">
                    Out of Stock
                </Badge>
            )}
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-2">
        <div className="space-y-1">
            <CardTitle className="text-base line-clamp-1" title={book.title}>
                <Link href={`/books/${bookSlug}`} className="hover:underline">
                    {book.title}
                </Link>
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">
                {book.authors && book.authors.length > 0 
                    ? book.authors.map(a => a.name).join(", ") 
                    : "Unknown Author"}
            </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs font-normal">
                {book.category?.name || "General"}
            </Badge>
            {book.publishedDate && (
                <span className="text-xs text-muted-foreground">
                    {new Date(book.publishedDate).getFullYear()}
                </span>
            )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 pb-4">
        <Button asChild className="w-full" variant="secondary">
            <Link href={`/books/${bookSlug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
