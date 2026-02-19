"use client"

import { BookForm } from "@/features/books/components/dashboard/book-form"
import { useToast } from "@/features/common/hooks/use-toast"
import { Book } from "@/features/books/types/book"
import { useUpdateBook } from "@/features/books/api/bookQueries"
import { BookCreateInput, BookUpdateInput } from "@/features/books/schemas/book"
import { handleApiError } from "@/lib/error-utils"

interface EditBookFormProps {
  book: Book
}

export function EditBookForm({ book }: EditBookFormProps) {
  const { toast } = useToast()
  const updateBookMutation = useUpdateBook()

  const handleSubmit = (data: BookCreateInput | BookUpdateInput) => {
    updateBookMutation.mutate({ id: book.id, data: data as BookUpdateInput }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Book updated successfully",
        })
      },
      onError: (error: unknown) => {
        const { message } = handleApiError(error)
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      },
    })
  }

  return (
    <BookForm 
      initialData={book}
      onSubmit={handleSubmit}
      isLoading={updateBookMutation.isPending}
    />
  )
}
