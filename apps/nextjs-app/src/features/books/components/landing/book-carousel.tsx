"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/features/common/components/ui/button"
import { BookDto } from "@/lib/api"
import { cn } from "@/lib/utils"

interface BookCarouselProps {
  title: string
  subtitle?: string
  books: BookDto[]
  className?: string
}

export function BookCarousel({ title, subtitle, books, className }: BookCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 300 * 2 // Scroll 2 cards at a time
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  if (!books || books.length === 0) return null

  return (
    <section className={cn("py-12", className)}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/5">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full h-10 w-10 border-primary/20 hover:bg-primary/5">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <Link 
              href={`/books/${book.id}`} 
              key={book.id} 
              className="min-w-[200px] sm:min-w-[240px] snap-start group focus:outline-none"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                {book.coverImageUrl ? (
                  <Image
                    src={book.coverImageUrl}
                    alt={book.title || "Book Cover"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 200px, 240px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                    <span className="text-muted-foreground font-medium">No Cover</span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge (Mock for now as API doesn't have rating yet) */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.5
                </div>
              </div>
              
              <div className="mt-4 space-y-1 px-1">
                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {book.authors && book.authors.length > 0 ? book.authors[0].name : "Unknown Author"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
