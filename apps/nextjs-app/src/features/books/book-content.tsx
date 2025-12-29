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
import { BookDescription } from "@/features/books/book-description"
import { BookReviews } from "@/features/books/book-reviews"
import { BookFloatingBar } from "@/features/books/book-floating-bar"

interface BookContentProps {
  id: string
}

export async function BookContent({ id }: BookContentProps) {
  let bookData = null

  try {
    const response = await BookControllerService.getBookById({id: Number(id)})
    bookData = response.data
  } catch (error) {
    console.error("Failed to fetch book:", error)
  }

  if (!bookData) {
    notFound()
  }

  // Mock Reviews (17 items) - Reviews API is not ready yet
  const reviews = [
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
