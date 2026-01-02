"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateAuthor } from "@/features/authors/api/authorQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { AuthorForm } from "./author-form"
import { AuthorUpdateInput } from "@/features/authors/schemas/author"
import { Author } from "@/features/authors/types/author"
import { handleApiError } from "@/lib/api-client/error-utils"

interface EditAuthorDialogProps {
  author: Author
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAuthorDialog({ author, open, onOpenChange }: EditAuthorDialogProps) {
  const { toast } = useToast()
  const updateAuthorMutation = useUpdateAuthor()

  function onSubmit(data: AuthorUpdateInput) {
    updateAuthorMutation.mutate({ id: author.id, data }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Author updated successfully",
        })
        onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Author</DialogTitle>
          <DialogDescription>
            Update author details.
          </DialogDescription>
        </DialogHeader>
        <AuthorForm 
          initialData={author} 
          onSubmit={onSubmit} 
          isLoading={updateAuthorMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  )
}
