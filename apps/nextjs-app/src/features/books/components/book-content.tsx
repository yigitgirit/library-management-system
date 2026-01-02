"use client"

import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import React, { useMemo } from "react"
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
  Library,
  LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookDescription } from "@/features/books/components/book-description"
import { BookReviews } from "@/features/books/components/book-reviews"
import { BookFloatingBar } from "@/features/books/components/book-floating-bar"
import { bookQueries } from "@/features/books/api/bookQueries"
import { Skeleton } from "@/components/ui/skeleton"
import { BookDetail } from "@/features/books/types/book"

type BookContentProps = {
  id: number
}

// Mock Reviews (17 items) - Reviews API is not ready yet
const MOCK_REVIEWS = [
  { id: 1, user: "Alice M.", rating: 4, comment: "The narrative structure is solid, though the pacing in the second act drags slightly due to excessive exposition.", date: "2 days ago" },
  { id: 2, user: "Burak K.", rating: 3, comment: "Karakter gelişimleri tutarlı ancak kurgudaki bazı teknik detaylar gerçekçilikten uzaklaşmış.", date: "1 week ago" },
  { id: 3, user: "Charlie K.", rating: 4, comment: "A comprehensive analysis of the subject matter. The author provides good references but lacks a modern perspective on chapter 4.", date: "2 weeks ago" },
  { id: 4, user: "Deniz Y.", rating: 4, comment: "Yazarın dili oldukça akıcı, fakat betimlemeler bazen olay örgüsünün önüne geçiyor. Teknik açıdan başarılı bir eser.", date: "3 weeks ago" },
  { id: 5, user: "Eve P.", rating: 3, comment: "Interesting concepts presented. The methodology used for the main argument is sound, but the conclusion feels rushed.", date: "1 month ago" },
  { id: 6, user: "Fatih S.", rating: 3, comment: "Konu ele alınış biçimiyle özgün. Ancak yan karakterlerin motivasyonları yeterince derinleştirilmemiş.", date: "1 month ago" },
  { id: 7, user: "Grace H.", rating: 4, comment: "Technically accurate descriptions of the era. The dialogue, however, feels slightly anachronistic at times.", date: "2 months ago" },
  { id: 8, user: "Hakan T.", rating: 4, comment: "Kurgu matematiği iyi kurulmuş. Olayların birbirine bağlanışı mantıklı, sadece final bölümü biraz daha detaylandırılabilirdi.", date: "2 months ago" },
  { id: 9, user: "Ivy R.", rating: 4, comment: "Good use of technical terminology without alienating the reader. A solid resource for intermediate learners.", date: "3 months ago" },
  { id: 10, user: "Jale N.", rating: 3, comment: "Sistematik bir anlatımı var. Bölümler arası geçişler yumuşak, ancak bazı teorik kısımlar daha fazla örnekle desteklenebilirdi.", date: "3 months ago" },
  { id: 11, user: "Kelly O.", rating: 3, comment: "The premise is executed well. The technical aspects of the plot are handled with care, though emotional resonance is minimal.", date: "4 months ago" },
  { id: 12, user: "Levent Y.", rating: 4, comment: "Dil bilgisi ve anlatım teknikleri açısından kusursuz. İçerik yoğunluğu sebebiyle yavaş okunması gereken bir kitap.", date: "5 months ago" },
  { id: 13, user: "Mia U.", rating: 3, comment: "Provides a balanced view on the topic. The statistical data cited is outdated, but the core arguments remain valid.", date: "6 months ago" },
  { id: 14, user: "Nihat I.", rating: 3, comment: "Teknik terimlerin kullanımı yerinde. Çeviri kalitesi genel olarak iyi olsa da bazı cümleler devrik kalmış.", date: "7 months ago" },
  { id: 15, user: "Olivia E.", rating: 4, comment: "Solid framework and logical progression of ideas. It serves well as a reference material rather than a casual read.", date: "8 months ago" },
  { id: 16, user: "Pelin W.", rating: 3, comment: "Yazarın konuya hakimiyeti belli oluyor. Akademik bir dille yazılmış, bu yüzden genel okuyucu için biraz ağır olabilir.", date: "9 months ago" },
  { id: 17, user: "Quinn Q.", rating: 3, comment: "The world-building relies heavily on established tropes but executes them with technical precision.", date: "10 months ago" },
]

export function BookContent({ id }: BookContentProps) {
  const { data: bookData, isLoading, isError } = useQuery(bookQueries.detail(id))

  const book = useMemo<BookDetail | null>(() => {
    if (!bookData) return null

    const publicationYear = bookData.publishedDate ? new Date(bookData.publishedDate).getFullYear().toString() : "Unknown"
    const isAvailable = (bookData.availableCopies || 0) > 0
    const statusDetail = isAvailable ? "Available on Shelf" : "Out of Stock"
    const locationDisplay = isAvailable && bookData.availableLocation ? bookData.availableLocation : "Ask Librarian"

    return {
      ...bookData,
      publicationYear,
      rating: 4.8, // Mock
      reviewCount: MOCK_REVIEWS.length, // Mock
      statusDetail,
      locationDisplay,
      isAvailable
    }
  }, [bookData])

  if (isLoading) {
    return <BookContentSkeleton />
  }

  if (isError || !book) {
    notFound()
  }

  return (
    <>
      <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
        
        {/* Left Column: Static */}
        <div className="flex flex-col gap-6">
          <BookCover book={book} />
          <BookLocationCard book={book} />
          
          <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>

          <BookStats book={book} />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-8">
          <BookHeader book={book} />
          <Separator />
          <BookDescription description={book.description || "No description available for this book."} />
          <BookDetailsGrid book={book} />
          <BookReviews reviews={MOCK_REVIEWS} />
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

function BookContentSkeleton() {
  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">
      <div className="flex flex-col gap-6">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Separator />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function BookCover({ book }: { book: BookDetail }) {
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

function BookLocationCard({ book }: { book: BookDetail }) {
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

function BookStats({ book }: { book: BookDetail }) {
  return (
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
  )
}

function BookHeader({ book }: { book: BookDetail }) {
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

function BookDetailsGrid({ book }: { book: BookDetail }) {
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
