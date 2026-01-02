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
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { Author } from "@/features/authors/types/author"
import { useDeleteAuthor } from "@/features/authors/api/authorQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { useState } from "react"
import { EditAuthorDialog } from "./edit-author-dialog"
import { ConfirmDeleteDialog } from "@/features/common/components/ui/confirm-delete-dialog"
import { handleApiError } from "@/lib/api-client/error-utils"

interface AuthorsTableActionsProps {
  author: Author
}

export function AuthorsTableActions({ author }: AuthorsTableActionsProps) {
  const { toast } = useToast()
  const deleteAuthorMutation = useDeleteAuthor()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteAuthorMutation.mutate(author.id, {
      onSuccess: () => {
        toast({ title: "Author deleted", description: "Author has been deleted successfully." })
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
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete Author
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditDialog && (
        <EditAuthorDialog 
          author={author} 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog} 
        />
      )}

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Author"
        description="Are you sure you want to delete this author? This action cannot be undone."
        trigger={null}
      />
    </>
  )
}
