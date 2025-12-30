"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authorManagementService } from "@/features/authors/services/management-service"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { useToast } from "@/features/common/components/ui/use-toast"
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Trash, 
  Edit 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu"

export function AuthorsManagementView() {
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch Authors
  const { data: authorsData, isLoading } = useQuery({
    queryKey: ['authors-management', page, searchQuery],
    queryFn: () => authorManagementService.getAllAuthors({ 
        page, 
        size: 10, 
        name: searchQuery || undefined
    })
  })

  const authors = authorsData?.content || []
  const totalPages = authorsData?.page?.totalPages || 0

  // Delete Mutation
  const deleteAuthorMutation = useMutation({
    mutationFn: (id: number) => authorManagementService.deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors-management'] })
      toast({ title: "Author deleted", description: "Author has been deleted successfully." })
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search authors..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Author
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Biography</TableHead>
              <TableHead>Birth Date</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : authors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No authors found.
                </TableCell>
              </TableRow>
            ) : (
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.id}</TableCell>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell className="max-w-xs truncate" title={author.biography}>{author.biography}</TableCell>
                  <TableCell>{author.birthDate}</TableCell>
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
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteAuthorMutation.mutate(author.id)} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete Author
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
