"use client"

import { BookForm } from "@/features/books/components/dashboard/book-form"
import { BookDto, BookManagementControllerService } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/features/common/components/ui/use-toast"

interface EditBookFormProps {
  book: BookDto
}

export function EditBookForm({ book }: EditBookFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const updateBookMutation = useMutation({
    mutationFn: (data: any) => BookManagementControllerService.updateBook({id: book.id!, requestBody: data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book', book.id] })
      toast({
        title: "Success",
        description: "Book updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <BookForm 
      initialData={book}
      onSubmit={(data) => updateBookMutation.mutate(data)}
      isLoading={updateBookMutation.isPending}
    />
  )
}
