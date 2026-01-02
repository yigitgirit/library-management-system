"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/features/common/hooks/use-toast"
import Link from "next/link"
import { Book } from "@/features/books/types/book"
import { useDeleteBook } from "@/features/books/api/bookQueries"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/features/common/components/ui/confirm-delete-dialog"
import { handleApiError } from "@/lib/api-client/error-utils"

interface BooksTableActionsProps {
  book: Book
}

export function BooksTableActions({ book }: BooksTableActionsProps) {
  const { toast } = useToast()
  const deleteBookMutation = useDeleteBook()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteBookMutation.mutate(book.id, {
      onSuccess: () => {
        toast({ title: "Book deleted", description: "Book has been deleted successfully." })
        setShowDeleteDialog(false)
      },
      onError: (error: unknown) => {
        const { message } = handleApiError(error)
        toast({ title: "Error", description: message, variant: "destructive" })
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/books/${book.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onSelect={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Book
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Book"
        description="Are you sure you want to delete this book? This action cannot be undone."
        trigger={null}
      />
    </>
  )
}
