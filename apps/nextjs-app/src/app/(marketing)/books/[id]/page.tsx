import "@/lib/api-client/api-config"
import { Metadata } from "next"
import Link from "next/link"
import { BookControllerService } from "@/lib/api"
import { Button } from "@/features/common/components/ui/button"
import { ArrowLeft } from "lucide-react"
import React, { Suspense } from "react"
import { BookContent } from "@/features/books/components/book-content"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { extractIdFromSlug } from "@/lib/utils"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug);

  try {
    const response = await BookControllerService.getBookById({id: id})
    const book = response.data
    
    if (!book) {
      return {
        title: "Book Not Found",
      }
    }

    return {
      title: `${book.title} - Library System`,
      description: book.description || `Details about ${book.title}`,
      openGraph: {
          title: book.title,
          description: book.description,
          images: [book.coverImageUrl || '/default-book-cover.jpg'],
      }
    }
  } catch (error) {
    return {
      title: "Error",
    }
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id: slug } = await params
  const id = extractIdFromSlug(slug);

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

        <Suspense fallback={<BookContentSkeleton />}>
            <BookContent id={String(id)} />
        </Suspense>
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
