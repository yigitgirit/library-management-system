"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/features/users/services/service"
import { User, Role } from "@/features/users/services/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
import { Badge } from "@/features/common/components/ui/badge"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { useToast } from "@/features/common/components/ui/use-toast"
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Trash, 
  Edit 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/common/components/ui/dialog"
import { Label } from "@/features/common/components/ui/label"
import { Checkbox } from "@/features/common/components/ui/checkbox"

export function UsersView() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("id,asc")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch Users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page, sort],
    queryFn: () => userService.getAllUsers({ page, size: 10, sort })
  })

  const users = usersData?.content || []
  const totalPages = usersData?.page?.totalPages || 0

  // Mutations
  const banUserMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number, reason: string }) => userService.banUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "User banned", description: "User has been banned successfully." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  const unbanUserMutation = useMutation({
    mutationFn: (id: number) => userService.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "User unbanned", description: "User has been unbanned successfully." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "User deleted", description: "User has been deleted successfully." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search users... (Coming Soon)" 
            className="w-[300px]" 
            disabled
          />
          <Button variant="outline" size="icon" disabled>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                        {user.roles.map(role => (
                            <Badge key={role} variant="outline" className="text-xs">
                                {role}
                            </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.locked ? (
                        <Badge variant="destructive">Banned</Badge>
                    ) : user.active ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    ) : (
                        <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
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
                        {user.locked ? (
                            <DropdownMenuItem onClick={() => unbanUserMutation.mutate(user.id)}>
                                <ShieldCheck className="mr-2 h-4 w-4 text-green-600" /> Unban User
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => banUserMutation.mutate({ id: user.id, reason: "Admin action" })}>
                                <ShieldAlert className="mr-2 h-4 w-4 text-orange-600" /> Ban User
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteUserMutation.mutate(user.id)} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm font-medium">
            Page {page + 1} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1 || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
