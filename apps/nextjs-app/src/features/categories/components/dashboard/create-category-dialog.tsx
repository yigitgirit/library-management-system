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
import { useCreateCategory } from "@/features/categories/api/categoryQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { Plus } from "lucide-react"
import { CategoryForm } from "./category-form"
import { CategoryCreateInput } from "@/features/categories/schemas/category"
import { handleApiError } from "@/lib/api-client/error-utils"

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const createCategoryMutation = useCreateCategory()

  function onSubmit(data: CategoryCreateInput) {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Category created successfully",
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
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new book category.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm onSubmit={onSubmit} isLoading={createCategoryMutation.isPending} />
      </DialogContent>
    </Dialog>
  )
}
