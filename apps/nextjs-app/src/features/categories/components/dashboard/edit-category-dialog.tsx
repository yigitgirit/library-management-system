"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateCategory } from "@/features/categories/api/categoryQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { CategoryForm } from "./category-form"
import { CategoryUpdateInput } from "@/features/categories/schemas/category"
import { Category } from "@/features/categories/types/category"
import { handleApiError } from "@/lib/error-utils"

interface EditCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const { toast } = useToast()
  const updateCategoryMutation = useUpdateCategory()

  function onSubmit(data: CategoryUpdateInput) {
    updateCategoryMutation.mutate({ id: category.id, data }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Category updated successfully",
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
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update category details.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm 
          initialData={category} 
          onSubmit={onSubmit} 
          isLoading={updateCategoryMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  )
}
