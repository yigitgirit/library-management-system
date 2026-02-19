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
import { useCreateLoan } from "@/features/loans/api/loanQueries"
import { LoanCreateInput, loanCreateSchema } from "@/features/loans/schemas/loan"
import { userService } from "@/features/users/services/userService"
import { useToast } from "@/features/common/hooks/use-toast"
import { Loader2, ExternalLink } from "lucide-react"
import { handleApiError } from "@/lib/error-utils"
import { copyService } from "@/features/copies/services/copyService"
import { useState, useEffect } from "react"
import { User } from "@/features/users/types/user"
import { Copy } from "@/features/copies/types/copy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { bookService } from "@/features/books/services/bookService"
import { Book } from "@/features/books/types/book"
import Image from "next/image"

interface CreateLoanFormProps {
  onSuccess: () => void
}

export function CreateLoanForm({ onSuccess }: CreateLoanFormProps) {
  const { toast } = useToast()
  const createLoanMutation = useCreateLoan()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [barcodeInput, setBarcodeInput] = useState("")
  const debouncedBarcode = useDebounce(barcodeInput, 500)

  const form = useForm<LoanCreateInput>({
    resolver: zodResolver(loanCreateSchema),
    defaultValues: {
      userId: 0,
      copyId: 0,
    },
  })

  const userId = form.watch("userId")

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const user = await userService.getById(userId)
          setSelectedUser(user)
        } catch (error) {
          console.error("Failed to fetch user", error)
          setSelectedUser(null)
        }
      } else {
        setSelectedUser(null)
      }
    }
    fetchUser()
  }, [userId])

  useEffect(() => {
    const fetchCopyByBarcode = async () => {
      if (debouncedBarcode) {
        try {
          const res = await copyService.getAll({ barcode: debouncedBarcode, size: 1 })
          if (res.content && res.content.length > 0) {
            const copy = res.content[0]
            setSelectedCopy(copy)
            form.setValue("copyId", copy.id)
            
            // Fetch full book details
            try {
                const book = await bookService.getById(copy.book.id)
                setSelectedBook(book)
            } catch (error) {
                console.error("Failed to fetch book details", error)
                setSelectedBook(null)
            }

          } else {
            setSelectedCopy(null)
            setSelectedBook(null)
            form.setValue("copyId", 0)
            toast({
              title: "Not Found",
              description: "No book copy found with this barcode.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Failed to fetch copy", error)
          setSelectedCopy(null)
          setSelectedBook(null)
          form.setValue("copyId", 0)
        }
      } else {
        setSelectedCopy(null)
        setSelectedBook(null)
        form.setValue("copyId", 0)
      }
    }
    fetchCopyByBarcode()
  }, [debouncedBarcode, form, toast])

  function onSubmit(data: LoanCreateInput) {
    const payload = {
      ...data,
      // Convert YYYY-MM-DD string from input to ISO 8601 Instant format
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    }

    createLoanMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Loan created successfully",
        })
        onSuccess()
        form.reset()
        setBarcodeInput("")
        setSelectedUser(null)
        setSelectedCopy(null)
        setSelectedBook(null)
      },
      onError: (error: unknown) => {
        const { message, validationErrors } = handleApiError(error)
        
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, errorMessage]) => {
            form.setError(field as keyof LoanCreateInput, {
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
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>User</FormLabel>
                      <FormControl>
                        <AsyncCombobox
                          value={field.value}
                          onChange={(val) => field.onChange(Number(val))}
                          fetchOptions={async (search) => {
                            const res = await userService.getAll({ size: 20 })
                            return res.content || []
                          }}
                          mapOption={(item) => ({
                            value: item.id,
                            label: `${item.firstName} ${item.lastName} (${item.email})`
                          })}
                          placeholder="Select user"
                          searchPlaceholder="Search by name or email..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Book Barcode
                  </label>
                  <Input 
                    placeholder="Scan or enter barcode..." 
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Hidden field to store copyId for form submission */}
                <FormField
                  control={form.control}
                  name="copyId"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createLoanMutation.isPending}>
                    {createLoanMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Loan
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 md:col-span-1">
        {selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Name:</span>
                <span className="col-span-2">{selectedUser.firstName} {selectedUser.lastName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Email:</span>
                <span className="col-span-2">{selectedUser.email}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCopy && selectedBook && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Book & Copy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              {/* Book Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-base">Book Information</h4>
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
                      <span className="font-medium text-muted-foreground">Authors:</span>
                      <span className="col-span-2">
                        {selectedBook.authors?.map(a => a.name).join(", ") || "Unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium text-muted-foreground">ISBN:</span>
                      <span className="col-span-2">{selectedBook.isbn}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Copy Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-base">Copy Information</h4>
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-muted-foreground">Barcode:</span>
                        <span className="col-span-2">{selectedCopy.barcode}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-muted-foreground">Status:</span>
                        <span className="col-span-2">{selectedCopy.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        <span className="font-medium text-muted-foreground">Location:</span>
                        <span className="col-span-2">{selectedCopy.location || "-"}</span>
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
        
        {(!selectedUser || !selectedCopy) && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-muted-foreground">
                <p>Select a user and scan a book barcode to see details here.</p>
            </div>
        )}
      </div>
    </div>
  )
}
