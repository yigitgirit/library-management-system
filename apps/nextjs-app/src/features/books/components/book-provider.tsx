"use client"

import React, { createContext, use, useMemo } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { bookQueries } from "@/features/books/api/bookQueries"
import { BookDetail } from "@/features/books/types/book"

interface BookContextValue {
  book: BookDetail
}

const BookContext = createContext<BookContextValue | null>(null)

export function useBook() {
  const context = use(BookContext)
  if (!context) {
    throw new Error("useBook must be used within a BookProvider")
  }
  return context
}

interface BookProviderProps {
  children: React.ReactNode
  bookId: number
}

export function BookProvider({ children, bookId }: BookProviderProps) {
  const { data: bookData } = useSuspenseQuery(bookQueries.detail(bookId))

  const contextValue = useMemo<BookContextValue>(() => {
    const publicationYear = bookData.publishedDate 
      ? new Date(bookData.publishedDate).getFullYear().toString() 
      : "Unknown"
      
    const isAvailable = (bookData.availableCopies || 0) > 0
    const statusDetail = isAvailable ? "Available on Shelf" : "Out of Stock"
    const locationDisplay = isAvailable && bookData.availableLocation 
      ? bookData.availableLocation 
      : "Ask Librarian"

    const sortedAuthors = bookData.authors.toSorted((a, b) => 
      (a.name || "").localeCompare(b.name || "")
    )

    return {
      book: {
        ...bookData,
        authors: sortedAuthors,
        publicationYear,
        statusDetail,
        locationDisplay,
        isAvailable
      }
    }
  }, [bookData])

  return (
    <BookContext value={contextValue}>
      {children}
    </BookContext>
  )
}