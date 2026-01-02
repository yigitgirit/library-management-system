"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AsyncCombobox } from "@/components/ui/async-combobox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { copyService } from "@/features/copies/services/copyService"
import { CopyCreateInput, copyCreateSchema } from "@/features/copies/schemas/copy"
import { bookService } from "@/features/books/services/bookService"
import { useToast } from "@/features/common/hooks/use-toast"
import { Loader2, ExternalLink } from "lucide-react"
import { handleApiError } from "@/lib/api-client/error-utils"
import { useState, useEffect } from "react"
import { Book } from "@/features/books/types/book"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

interface CreateCopyFormProps {
  onSuccess: () => void
}

export function CreateCopyForm({ onSuccess }: CreateCopyFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const createCopyMutation = useMutation({
    mutationFn: copyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] })
    },
  })

  const form = useForm<CopyCreateInput>({
    resolver: zodResolver(copyCreateSchema),
    defaultValues: {
      bookId: 0,
      barcode: "",
      location: "",
    },
  })

  const bookId = form.watch("bookId")

  useEffect(() => {
    const fetchBook = async () => {
      if (bookId) {
        try {
          const book = await bookService.getById(bookId)
          setSelectedBook(book)
        } catch (error) {
          console.error("Failed to fetch book", error)
          setSelectedBook(null)
        }
      } else {
        setSelectedBook(null)
      }
    }
    fetchBook()
  }, [bookId])

  function onSubmit(data: CopyCreateInput) {
    createCopyMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Copy added successfully",
        })
        onSuccess()
        form.reset({
          bookId: 0,
          barcode: "",
          location: "",
        })
        setSelectedBook(null)
      },
      onError: (error: unknown) => {
        const { message, validationErrors } = handleApiError(error)
        
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, errorMessage]) => {
            form.setError(field as keyof CopyCreateInput, {
              type: "server",
              message: errorMessage,
            })
          })
        }

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      },
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Copy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bookId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Book</FormLabel>
                      <FormControl>
                        <AsyncCombobox
                          value={field.value}
                          onChange={(val) => field.onChange(Number(val))}
                          fetchOptions={async (search) => {
                            const isIsbn = /^[\d-]+$/.test(search)
                            const params = isIsbn ? { isbn: search } : { title: search }
                            const res = await bookService.getAll({ ...params, size: 20 })
                            return res.content || []
                          }}
                          mapOption={(item) => ({
                            value: item.id,
                            label: `${item.title} (ISBN: ${item.isbn})`
                          })}
                          placeholder="Select book"
                          searchPlaceholder="Search by title or ISBN..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Scan or enter barcode..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3. Floor, Section U, Shelf 12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createCopyMutation.isPending}>
                    {createCopyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Copy
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 md:col-span-1">
        {selectedBook && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-4">
                {selectedBook.coverImageUrl ? (
                  <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={selectedBook.coverImageUrl}
                      alt={selectedBook.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error("Error loading image:", selectedBook.coverImageUrl);
                        e.currentTarget.style.display = 'none'; 
                      }}
                    />
                  </div>
                ) : (
                   <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                      No Cover
                   </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-muted-foreground">Title:</span>
                    <span className="col-span-2">{selectedBook.title}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-muted-foreground">Author:</span>
                    <span className="col-span-2">{selectedBook.authors?.map(a => a.name).join(", ") || "Unknown"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-muted-foreground">ISBN:</span>
                    <span className="col-span-2">{selectedBook.isbn}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-muted-foreground">Publisher:</span>
                    <span className="col-span-2">{selectedBook.publisher || "-"}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/books/${selectedBook.id}`} target="_blank">
                    View Book Catalog <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!selectedBook && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-muted-foreground">
                <p>Select a book to see details here.</p>
            </div>
        )}
      </div>
    </div>
  )
}
