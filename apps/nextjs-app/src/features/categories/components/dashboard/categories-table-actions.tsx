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
import { Category } from "@/features/categories/types/category"
import { useDeleteCategory } from "@/features/categories/api/categoryQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { useState } from "react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { ConfirmDeleteDialog } from "@/features/common/components/ui/confirm-delete-dialog"
import { handleApiError } from "@/lib/error-utils"

interface CategoriesTableActionsProps {
  category: Category
}

export function CategoriesTableActions({ category }: CategoriesTableActionsProps) {
  const { toast } = useToast()
  const deleteCategoryMutation = useDeleteCategory()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => {
        toast({ title: "Category deleted", description: "Category has been deleted successfully." })
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
            <Trash className="mr-2 h-4 w-4" /> Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditDialog && (
        <EditCategoryDialog 
          category={category} 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog} 
        />
      )}

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        trigger={null}
      />
    </>
  )
}
