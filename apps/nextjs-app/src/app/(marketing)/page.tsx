import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ScanBarcode, ListChecks, Search, ShieldCheck, LucideIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { BookCarousel } from "@/features/books/components/landing/book-carousel"
import { FaqSection } from "@/components/landing/faq-section"
import { getCurrentUser } from "@/features/auth/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeroSearch } from "@/features/books/components/landing/hero-search"
import { bookService } from "@/features/books/services/bookService"
import { Book } from "@/features/books/types/book"

async function getBooks(sort: string[] = ['title,asc']): Promise<Book[]> {
  try {
    const response = await bookService.getAll({ sort, size: 10 });
    return response.content || [];
  } catch (error) {
    console.warn("Failed to fetch books:", error);
    return [];
  }
}

export default async function Home() {
  const user = await getCurrentUser();

  // Fetch data in parallel
  const [newArrivals, featuredBooks, popularBooks] = await Promise.all([
    getBooks(['createdAt,desc']), // New Arrivals
    getBooks(['title,asc']),      // Featured (Mock sort)
    getBooks(['price,desc']),     // Popular (Mock sort)
  ]);

  // Mock Data for Interstitials
  const favoriteAuthors = [
    { name: "Frank Herbert", genre: "Sci-Fi", count: 12 },
    { name: "J.R.R. Tolkien", genre: "Fantasy", count: 8 },
    { name: "Isaac Asimov", genre: "Sci-Fi", count: 5 },
    { name: "Agatha Christie", genre: "Mystery", count: 4 },
  ]

  const reviews = [
    { id: 1, user: "Alice M.", book: "Dune", comment: "An absolute masterpiece. The world-building is unparalleled.", rating: 5, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81ym3QUd3KL.jpg" },
    { id: 3, user: "Bob D.", book: "1984", comment: "Chilling and thought-provoking. A must-read for everyone.", rating: 5, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg" },
    { id: 2, user: "Charlie K.", book: "The Hobbit", comment: "A delightful adventure that started it all.", rating: 4, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg" },
  ]

  return (
    <>
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-38 overflow-hidden flex items-center justify-center min-h-[75vh]">
            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl text-center">
                <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                    <Badge variant="secondary" className="text-sm font-medium px-4 py-1.5 backdrop-blur-md bg-background/50 border-primary/20 rounded-full hover:cursor-default">
                        {user ? `Welcome back, ${user.firstName}!` : "Welcome to the Future of Libraries"}
                    </Badge>

                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground max-w-3xl mx-auto leading-tight">
                        {user ? (
                            <>
                                Ready to continue your <br/>
                                <span className="text-primary">reading journey?</span>
                            </>
                        ) : (
                            <>
                                Discover. Borrow. <br/>
                                <span className="text-primary">Read. Repeat.</span>
                            </>
                        )}
                    </h1>

                    <p className="text-base text-muted-foreground md:text-lg leading-relaxed max-w-[650px] mx-auto">
                        {user ? (
                            "Explore our collection, manage loans, and discover your next favorite book with our recommendation engine."
                        ) : (
                            "Access a world of knowledge with our library management system. Seamless discovery, smart recommendations, and a community of readers await."
                        )}
                    </p>

                    <div className="w-full max-w-xl mx-auto pt-3">
                        <HeroSearch />
                    </div>
                </div>
            </div>
        </section>

        {/* Book Showcases & Interstitials */}
        <div className="space-y-16 py-12 bg-background">
            
            {/* 1. User Picks & Favorite Authors */}
            {user && (
                <div className="space-y-12">
                    <BookCarousel 
                        title={`Picks for ${user.firstName}`} 
                        subtitle="Based on your reading history" 
                        books={featuredBooks} 
                        className="bg-muted/30 py-12"
                    />
                    
                    {/* Favorite Authors Interstitial */}
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">Your Favorite Authors</h3>
                                <p className="text-muted-foreground">You seem to enjoy their work the most.</p>
                            </div>
                            <Button variant="ghost" asChild>
                                <Link href="/books">View All Authors</Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {favoriteAuthors.map((author, i) => (
                                <Link href={`/books?search=${author.name}`} key={i} className="group">
                                    <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1 border-muted">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {author.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-primary transition-colors">{author.name}</h4>
                                                <p className="text-xs text-muted-foreground">{author.genre} • {author.count} Books</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. New Arrivals & Reviews */}
            <div className="space-y-12">
                <BookCarousel 
                    title="New Arrivals" 
                    subtitle="Fresh from the press" 
                    books={newArrivals} 
                />

                {/* Reviews Interstitial (Horizontal Layout - Larger & Tighter) */}
                <div className="bg-muted/30 py-16">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold tracking-tight">What Readers Are Saying</h3>
                            <p className="text-muted-foreground">Community reviews on our latest collection.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {reviews.map((review, i) => (
                                <Card key={i} className="bg-background border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden group h-56">
                                    <div className="flex h-full p-5 gap-5">
                                        {/* Left: Book Cover (Rounded, Inside Padding) */}
                                        <Link 
                                            href={`/books/${review.id}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="relative h-full aspect-[2/3] bg-muted cursor-pointer shrink-0 rounded-lg overflow-hidden shadow-sm"
                                        >
                                            <Image 
                                                src={review.coverUrl} 
                                                alt={review.book} 
                                                fill 
                                                sizes="150px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        </Link>
                                        
                                        {/* Right: Content */}
                                        <div className="flex-1 flex flex-col justify-between overflow-hidden py-1">
                                            <div>
                                                <div className="flex gap-0.5 mb-3">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} className={`h-4 w-4 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted/30"}`} />
                                                    ))}
                                                </div>
                                                <p className="text-base text-muted-foreground italic leading-relaxed line-clamp-4 mb-2">&#34;{review.comment}&#34;</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 pt-3 border-t border-border/50 mt-auto">
                                                <Avatar className="h-10 w-10 border border-border shrink-0">
                                                    <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">{review.user.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{review.user}</p>
                                                    <Link 
                                                        href={`/books/${review.id}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline truncate block"
                                                    >
                                                        on {review.book}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Most Popular & Stats */}
            <div className="space-y-12">
                <BookCarousel 
                    title="Most Popular" 
                    subtitle="Community favorites" 
                    books={popularBooks} 
                />
                
                {/* Stats Interstitial (Real Data) */}
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/50">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">10k+</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Books Available</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">5k+</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Members</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">24/7</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Online Access</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">100%</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Free to Join</div>
                        </div>
                    </div>
                </div>
            </div>

             {/* 4. Trending */}
            <BookCarousel 
                title="Trending Now" 
                subtitle="What everyone is reading" 
                books={featuredBooks} 
                className="bg-muted/30 py-12"
            />
        </div>

        {/* Features / Workflow Section */}
        <section className="w-full py-16 bg-background border-t">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Manage Your Reading</h2>
                <p className="text-muted-foreground text-lg">
                    Our platform is designed to provide a seamless and secure library experience for everyone.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <FeatureCard 
                    icon={ScanBarcode}
                    title="Quick Checkout"
                    description="Find your book, grab it from the shelf, and check out in seconds at our desk with your library card."
                />
                <FeatureCard 
                    icon={ListChecks}
                    title="Smart Readlists"
                    description="Create and manage your personal reading lists. Track what you've read and plan what's next."
                />
                <FeatureCard 
                    icon={Search}
                    title="Advanced Search"
                    description="Find exactly what you're looking for with powerful filtering by genre, author, publisher, and more."
                />
                <FeatureCard 
                    icon={ShieldCheck}
                    title="Secure & Private"
                    description="Your data is protected with enterprise-grade security. We prioritize your privacy and data integrity."
                />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
    </>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
    return (
        <div className="flex flex-col items-start p-6 bg-background rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl mb-5">
                <Icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
                {description}
            </p>
        </div>
    )
}
