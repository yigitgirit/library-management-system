import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import React, { Suspense } from "react"
import { BookContent } from "@/features/books/components/book-content"
import { Skeleton } from "@/components/ui/skeleton"
import { extractIdFromSlug } from "@/lib/utils"
import { bookService } from "@/features/books/services/bookService"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { bookQueries } from "@/features/books/api/bookQueries"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(
  { params }: BookPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug)

  try {
    const book = await bookService.getById(id)

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
      ?.map((a) => a.name)
      .filter((name): name is string => !!name) || []

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
  } catch (error) {
    return {
      title: "Error - Library System",
      description: "An error occurred while fetching book details.",
    }
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug);
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(bookQueries.detail(id))

  return (
    <div className="flex min-h-screen flex-col">
      
      {/* Main Content Container - Consistent with SiteHeader */}
      <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8 lg:py-12">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary -ml-2">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<BookContentSkeleton />}>
                <BookContent id={id} />
            </Suspense>
        </HydrationBoundary>
      </main>
    </div>
  )
}

function BookContentSkeleton() {
    return (
        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
            {/* Left Column Skeleton */}
            <div className="flex flex-col gap-6">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Right Column Skeleton */}
            <div className="flex flex-col gap-8">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-8 w-1/2" />
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-24 w-full" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl p-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
