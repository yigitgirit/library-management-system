"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateAuthor } from "@/features/authors/api/authorQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { Plus } from "lucide-react"
import { AuthorForm } from "./author-form"
import { AuthorCreateInput } from "@/features/authors/schemas/author"
import { handleApiError } from "@/lib/api-client/error-utils"

export function CreateAuthorDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const createAuthorMutation = useCreateAuthor()

  function onSubmit(data: AuthorCreateInput) {
    createAuthorMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Author created successfully",
        })
        setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9">
          <Plus className="mr-2 h-4 w-4" /> Add Author
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Author</DialogTitle>
          <DialogDescription>
            Create a new author record.
          </DialogDescription>
        </DialogHeader>
        <AuthorForm onSubmit={onSubmit} isLoading={createAuthorMutation.isPending} />
      </DialogContent>
    </Dialog>
  )
}
