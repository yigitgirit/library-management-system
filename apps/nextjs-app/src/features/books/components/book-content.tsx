"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  BookOpen, Calendar, FileText, Building2, Globe, 
  Barcode, Star, Heart, MapPin, Library, LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookDescription } from "@/features/books/components/book-description"
import { BookFloatingBar } from "@/features/books/components/book-floating-bar"
import { BookReviewsSection } from "@/features/reviews/components/book-reviews-section"
import { useBook } from "./book-provider"

export const Book = {
  Content: BookContent,
  Cover: BookCover,
  LocationCard: BookLocationCard,
  Stats: BookStats,
  Header: BookHeader,
  DetailsGrid: BookDetailsGrid,
}

export function BookContent() {
  const { book } = useBook()

  return (
    <>
      <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
        
        {/* Left Column: Static */}
        <div className="flex flex-col gap-6">
          <BookCover />
          <BookLocationCard />

          <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>

          <BookStats />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-8">
          <BookHeader />
          <Separator />
          <BookDescription description={book.description || "No description available for this book."} />
          <BookDetailsGrid />
          <BookReviewsSection bookId={book.id} />
        </div>
      </div>
      
      <BookFloatingBar 
        title={book.title || "Book"} 
        coverUrl={book.coverImageUrl} 
        location={book.locationDisplay}
      />
    </>
  )
}

// --- Subcomponents ---

function BookCover() {
  const { book } = useBook()

  return (
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
  )
}

function BookLocationCard() {
  const { book } = useBook()

  return (
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
              {book.isAvailable 
                  ? "No reservation needed. Just walk in and grab it from the shelf!"
                  : "Currently unavailable. Please check back later."}
          </div>
      </div>
    </div>
  )
}

function BookStats() {
  const { book } = useBook()

  return (
    <div className="grid grid-cols-2 gap-4 text-center p-4 bg-muted/30 rounded-lg border">
      <div>
          <div className="text-2xl font-bold text-primary">{book.averageRating.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground flex justify-center items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" /> Rating
          </div>
      </div>
      <div>
          <div className="text-2xl font-bold text-primary">{book.reviewCount}</div>
          <div className="text-xs text-muted-foreground">Reviews</div>
      </div>
    </div>
  )
}

function BookHeader() {
  const { book } = useBook()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="px-3 py-1 text-sm">{book.category?.name || "General"}</Badge>
        {book.isAvailable ? (
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
  )
}

function BookDetailsGrid() {
  const { book } = useBook()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border rounded-xl p-6 bg-card shadow-sm">
      <DetailItem icon={Building2} label="Publisher" value={book.publisher} />
      <DetailItem icon={Calendar} label="Published" value={book.publicationYear} />
      <DetailItem icon={FileText} label="Pages" value={book.pageCount} />
      <DetailItem icon={Globe} label="Language" value={book.language} />
      <DetailItem icon={BookOpen} label="Format" value={book.format} />
      <DetailItem icon={Barcode} label="ISBN" value={book.isbn} isMono />
    </div>
  )
}

function DetailItem({ icon: Icon, label, value, isMono }: { icon: LucideIcon, label: string, value: string | number | undefined, isMono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={`font-medium ${isMono ? 'font-mono' : ''}`}>{value || "N/A"}</span>
      </div>
    </div>
  )
}