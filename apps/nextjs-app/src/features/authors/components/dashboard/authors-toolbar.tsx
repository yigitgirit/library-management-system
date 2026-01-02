"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  X,
} from "lucide-react"
import { ToolbarLayout } from "@/components/ui/toolbar-layout"
import { CreateAuthorDialog } from "./create-author-dialog"

type AuthorsToolbarProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  hasActiveFilters: boolean
  resetFilters: () => void
}

export function AuthorsToolbar({ 
  searchQuery, 
  setSearchQuery, 
  hasActiveFilters, 
  resetFilters 
}: AuthorsToolbarProps) {
  
  return (
    <ToolbarLayout
      filters={
        <>
          {/* Search */}
          <div className="relative w-full sm:w-64 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search authors..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
            >
              Clear all
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </>
      }
      actions={
        <CreateAuthorDialog />
      }
    />
  )
}
