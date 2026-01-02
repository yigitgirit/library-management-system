"use client"

import { BookForm } from "@/features/books/components/dashboard/book-form"
import { useCreateBook } from "@/features/books/api/bookQueries"
import { useRouter } from "next/navigation"
import { useToast } from "@/features/common/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BookCreateInput, BookUpdateInput } from "@/features/books/schemas/book"
import { handleApiError } from "@/lib/api-client/error-utils"

export default function NewBookPage() {
  const router = useRouter()
  const { toast } = useToast()
  const createBookMutation = useCreateBook()

  const handleSubmit = (data: BookCreateInput | BookUpdateInput) => {
    createBookMutation.mutate(data as BookCreateInput, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Book created successfully",
        })
        router.push("/dashboard/books")
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/books">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Book</h2>
          <p className="text-sm text-muted-foreground">
            Add a new book to the library catalog.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          <CardDescription>
            Enter the details for the new book.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookForm 
            onSubmit={handleSubmit}
            isLoading={createBookMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
