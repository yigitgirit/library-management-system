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
import { MoreHorizontal, ShieldAlert, ShieldCheck, Edit, Trash } from "lucide-react"
import { User } from "@/features/users/types/user"
import { useBanUser, useUnbanUser, useDeleteUser } from "@/features/users/api/userQueries"
import { useToast } from "@/features/common/hooks/use-toast"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/features/common/components/ui/confirm-delete-dialog"
import { handleApiError } from "@/lib/api-client/error-utils"

interface UsersTableActionsProps {
  user: User
}

export function UsersTableActions({ user }: UsersTableActionsProps) {
  const { toast } = useToast()
  const banUserMutation = useBanUser()
  const unbanUserMutation = useUnbanUser()
  const deleteUserMutation = useDeleteUser()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleBan = () => {
    banUserMutation.mutate({ id: user.id, reason: "Admin action" }, {
      onSuccess: () => toast({ title: "User banned", description: "User has been banned successfully." }),
      onError: (error: unknown) => {
        const { message } = handleApiError(error)
        toast({ title: "Error", description: message, variant: "destructive" })
      }
    })
  }

  const handleUnban = () => {
    unbanUserMutation.mutate(user.id, {
      onSuccess: () => toast({ title: "User unbanned", description: "User has been unbanned successfully." }),
      onError: (error: unknown) => {
        const { message } = handleApiError(error)
        toast({ title: "Error", description: message, variant: "destructive" })
      }
    })
  }

  const handleDelete = () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        toast({ title: "User deleted", description: "User has been deleted successfully." })
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          {user.status === 'BANNED' ? (
              <DropdownMenuItem onClick={handleUnban}>
                  <ShieldCheck className="mr-2 h-4 w-4 text-green-600" /> Unban User
              </DropdownMenuItem>
          ) : (
              <DropdownMenuItem onClick={handleBan}>
                  <ShieldAlert className="mr-2 h-4 w-4 text-orange-600" /> Ban User
              </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        trigger={null}
      />
    </>
  )
}
