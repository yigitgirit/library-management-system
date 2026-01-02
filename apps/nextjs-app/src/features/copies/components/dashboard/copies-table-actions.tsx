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
import { MoreHorizontal, Archive, Edit } from "lucide-react"
import { Copy } from "@/features/copies/types/copy"
import { useRetireCopy } from "@/features/copies/api/copyQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/features/common/components/ui/confirm-delete-dialog"
import { handleApiError } from "@/lib/api-client/error-utils"

interface CopiesTableActionsProps {
  copy: Copy
}

export function CopiesTableActions({ copy }: CopiesTableActionsProps) {
  const { toast } = useToast()
  const retireCopyMutation = useRetireCopy()
  const [showRetireDialog, setShowRetireDialog] = useState(false)

  const handleRetire = () => {
    retireCopyMutation.mutate(copy.id, {
      onSuccess: () => {
        toast({ title: "Copy retired", description: "Copy has been retired successfully." })
        setShowRetireDialog(false)
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
          <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowRetireDialog(true)} className="text-destructive focus:text-destructive">
              <Archive className="mr-2 h-4 w-4" /> Retire Copy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={showRetireDialog}
        onOpenChange={setShowRetireDialog}
        onConfirm={handleRetire}
        title="Retire Copy"
        description="Are you sure you want to retire this copy? It will be marked as retired and cannot be loaned."
        trigger={null}
      />
    </>
  )
}
