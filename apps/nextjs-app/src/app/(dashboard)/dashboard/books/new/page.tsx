"use client"

import { BookForm } from "@/features/books/components/dashboard/book-form"
import { BookManagementControllerService } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/features/common/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card"
import { Button } from "@/features/common/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBookPage() {
  const router = useRouter()
  const { toast } = useToast()

  const createBookMutation = useMutation({
    mutationFn: BookManagementControllerService.createBook,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Book created successfully",
      })
      router.push("/dashboard/books")
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
            onSubmit={(data) => createBookMutation.mutate({requestBody: data})}
            isLoading={createBookMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
