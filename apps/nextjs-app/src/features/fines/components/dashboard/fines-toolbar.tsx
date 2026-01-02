"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  X,
  Filter,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FineStatus } from "@/features/fines/types/fine"
import { ToolbarLayout } from "@/components/ui/toolbar-layout"

type FinesToolbarProps = {
  searchEmail: string
  setSearchEmailAction: (value: string) => void
  status: FineStatus | "ALL"
  setStatusAction: (status: FineStatus | "ALL") => void
  hasActiveFilters: boolean
  resetFiltersAction: () => void
}

export function FinesToolbar({ 
  searchEmail, 
  setSearchEmailAction, 
  status, 
  setStatusAction, 
  hasActiveFilters, 
  resetFiltersAction 
}: FinesToolbarProps) {
  
  return (
    <ToolbarLayout
      filters={
        <>
          {/* Search Email */}
          <div className="relative w-full sm:w-64 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user email..."
              className="pl-9 h-9"
              value={searchEmail}
              onChange={(e) => setSearchEmailAction(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={status} 
            onValueChange={(val) => setStatusAction(val as FineStatus | "ALL")}
          >
            <SelectTrigger className="w-[160px] h-9">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={FineStatus.UNPAID}>Unpaid</SelectItem>
                <SelectItem value={FineStatus.PAID}>Paid</SelectItem>
                <SelectItem value={FineStatus.WAIVED}>Waived</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear All */}
          {hasActiveFilters && (
            <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFiltersAction}
            >
              Clear all
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </>
      }
    />
  )
}
