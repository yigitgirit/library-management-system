import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { extractIdFromSlug } from "@/lib/utils"
import { getQueryClient } from "@/lib/query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { cache } from "react"
import { bookQueries } from "@/features/books/api/bookQueries"
import { BookProvider } from "@/features/books/components/book-provider"
import { BookContent } from "@/features/books/components/book-content"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

const getCachedBook = cache(async (id: number) => {
  const queryClient = getQueryClient()
  return await queryClient.fetchQuery(bookQueries.detail(id))
})

export async function generateMetadata(
  { params }: BookPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug)

  try {
    const book = await getCachedBook(id)

    if (!book) {
      return {
        title: "Book Not Found - Library System",
      }
    }

    const previousImages = (await parent).openGraph?.images || []
    const title = `${book.title} - Library System`
    const description = book.description || `Details about ${book.title}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://library.com"
    const url = `${baseUrl}/books/${slug}`

    const images = book.coverImageUrl
      ? [
          {
            url: book.coverImageUrl,
            width: 800,
            height: 600,
            alt: `Cover of ${book.title}`,
          },
          ...previousImages,
        ]
      : previousImages

    const authors = book.authors
      .map((a) => a.name)
      .filter((name): name is string => !!name)
      .toSorted((a, b) => a.localeCompare(b))

    return {
      title,
      description,
      authors: authors.map((name) => ({ name })),
      openGraph: {
        title: book.title,
        description,
        url,
        siteName: "Library System",
        images,
        type: "book",
        authors: authors,
      },
      twitter: {
        card: "summary_large_image",
        title: book.title,
        description,
        images,
      },
    }
  } catch {
    return {
      title: "Error - Library System",
      description: "An error occurred while fetching book details.",
    }
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug)

  const book = await getCachedBook(id).catch(() => null)

  if (!book) {
    notFound()
  }

  const queryClient = getQueryClient()
  queryClient.setQueryData(bookQueries.detail(id).queryKey, book)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content Container */}
      <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8 lg:py-12">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            asChild 
            className="pl-0 hover:bg-transparent hover:text-primary -ml-2"
          >
            <Link 
              href="/books"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
        </div>
        
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BookProvider bookId={id}>
            <BookContent />
          </BookProvider>
        </HydrationBoundary>
      </main>
    </div>
  )
}
