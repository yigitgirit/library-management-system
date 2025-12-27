import { BookControllerService } from "@/lib/api"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { 
  BookOpen,
  Calendar, 
  FileText, 
  Building2, 
  Globe, 
  Barcode,
  Star,
  Heart,
  MapPin,
  Library
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookDescription } from "@/components/books/book-description"
import { BookReviews } from "@/components/books/book-reviews"
import { BookFloatingBar } from "@/components/books/book-floating-bar"

interface BookContentProps {
  id: string
}

export async function BookContent({ id }: BookContentProps) {
  let bookData = null

  try {
    const response = await BookControllerService.getBookById(Number(id))
    bookData = response.data
  } catch (error) {
    console.error("Failed to fetch book:", error)
  }

  if (!bookData) {
    notFound()
  }

  // Mock Reviews (17 items) - Reviews API is not ready yet
  const reviews = [
    { id: 1, user: "Alice M.", rating: 5, comment: "An absolute masterpiece. Must read!", date: "2 days ago" },
    { id: 2, user: "Bob D.", rating: 4, comment: "Great story but a bit slow in the middle.", date: "1 week ago" },
    { id: 3, user: "Charlie K.", rating: 5, comment: "Couldn't put it down. Highly recommended.", date: "2 weeks ago" },
    { id: 4, user: "David L.", rating: 3, comment: "It was okay, but I expected more from the hype.", date: "3 weeks ago" },
    { id: 5, user: "Eve P.", rating: 5, comment: "One of the best books I've read this year.", date: "1 month ago" },
    { id: 6, user: "Frank S.", rating: 4, comment: "Solid writing and great character development.", date: "1 month ago" },
    { id: 7, user: "Grace H.", rating: 2, comment: "Not my cup of tea. Too descriptive.", date: "2 months ago" },
    { id: 8, user: "Henry T.", rating: 5, comment: "A classic for a reason.", date: "2 months ago" },
    { id: 9, user: "Ivy R.", rating: 4, comment: "Enjoyed it thoroughly.", date: "3 months ago" },
    { id: 10, user: "Jack N.", rating: 5, comment: "Life changing book.", date: "3 months ago" },
    { id: 11, user: "Kelly O.", rating: 3, comment: "Good but repetitive.", date: "4 months ago" },
    { id: 12, user: "Liam Y.", rating: 5, comment: "Brilliant!", date: "5 months ago" },
    { id: 13, user: "Mia U.", rating: 4, comment: "Very engaging plot.", date: "6 months ago" },
    { id: 14, user: "Noah I.", rating: 5, comment: "Loved every page.", date: "7 months ago" },
    { id: 15, user: "Olivia E.", rating: 1, comment: "Boring.", date: "8 months ago" },
    { id: 16, user: "Peter W.", rating: 5, comment: "Fantastic read.", date: "9 months ago" },
    { id: 17, user: "Quinn Q.", rating: 4, comment: "Well written.", date: "10 months ago" },
  ]

  // Prepare display data
  const publicationYear = bookData.publishedDate ? new Date(bookData.publishedDate).getFullYear().toString() : "Unknown"
  const isAvailable = (bookData.availableCopies || 0) > 0
  const statusDetail = isAvailable ? "Available on Shelf" : "Out of Stock"
  const locationDisplay = isAvailable && bookData.availableLocation ? bookData.availableLocation : "Ask Librarian"

  // Merge with mock data for missing fields (Rating/Reviews are not in BookDto yet)
  const book = {
    ...bookData,
    publicationYear,
    rating: 4.8, // Mock
    reviewCount: reviews.length, // Mock
    statusDetail,
    locationDisplay
  }

  return (
    <>
      <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
        
        {/* Left Column: Static */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border bg-muted shadow-lg">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title || "Book Cover"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 300px, 350px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <BookOpen className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}
          </div>
          
          {/* Location Card (Replaces Borrow Button) */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-sm text-primary">Physical Location</h3>
                      <p className="text-xs text-muted-foreground">Find this book in the library</p>
                  </div>
              </div>
              <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                      <Library className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{book.locationDisplay}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                      {isAvailable 
                          ? "No reservation needed. Just walk in and grab it from the shelf!" 
                          : "Currently unavailable. Please check back later."}
                  </div>
              </div>
          </div>

          <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center p-4 bg-muted/30 rounded-lg border">
              <div>
                  <div className="text-2xl font-bold text-primary">{book.rating}</div>
                  <div className="text-xs text-muted-foreground flex justify-center items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" /> Rating
                  </div>
              </div>
              <div>
                  <div className="text-2xl font-bold text-primary">{book.reviewCount}</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm">{book.category?.name || "General"}</Badge>
              {isAvailable ? (
                  <Badge variant="outline" className="px-3 py-1 text-sm border-green-500/50 text-green-600 bg-green-500/10">
                      {book.statusDetail} ({book.availableCopies} copies)
                  </Badge>
              ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm">Out of Stock</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {book.title}
            </h1>
            
            <div className="flex items-center gap-2 text-xl text-muted-foreground">
              <span>by</span>
              <span className="font-semibold text-foreground">
                  {book.authors && book.authors.length > 0 
                      ? book.authors.map((author, index) => (
                          <React.Fragment key={author.id || index}>
                            <Link href={`/authors/${author.id}`} className="hover:underline hover:text-primary transition-colors">
                              {author.name}
                            </Link>
                            {index < (book.authors?.length || 0) - 1 && ", "}
                          </React.Fragment>
                        ))
                      : "Unknown Author"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Description Component */}
          <BookDescription description={book.description || "No description available for this book."} />

          {/* Details Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl p-6 bg-card shadow-sm">
              <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Publisher</span>
                      <span className="font-medium">{book.publisher || "N/A"}</span>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Published</span>
                      <span className="font-medium">{book.publicationYear}</span>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Pages</span>
                      <span className="font-medium">{book.pageCount || "N/A"}</span>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Language</span>
                      <span className="font-medium">{book.language || "N/A"}</span>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Format</span>
                      <span className="font-medium">{book.format || "N/A"}</span>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Barcode className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">ISBN</span>
                      <span className="font-medium font-mono">{book.isbn || "N/A"}</span>
                  </div>
              </div>
          </div>

          {/* Reviews Component */}
          <BookReviews reviews={reviews} />

        </div>
      </div>
      
      {/* Floating Bar */}
      <BookFloatingBar 
        title={book.title || "Book"} 
        coverUrl={book.coverImageUrl} 
        location={book.locationDisplay}
      />
    </>
  )
}
