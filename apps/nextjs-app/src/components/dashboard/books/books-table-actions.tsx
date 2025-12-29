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
import { BookDto, BookManagementControllerService } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface BooksTableActionsProps {
  book: BookDto
}

export function BooksTableActions({ book }: BooksTableActionsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => BookManagementControllerService.deleteBook({id: id}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books-management'] })
      toast({ title: "Book deleted", description: "Book has been deleted successfully." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  return (
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
          onClick={() => deleteBookMutation.mutate(book.id!)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete Book
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
