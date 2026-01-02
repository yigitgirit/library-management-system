"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  Circle,
  DollarSign,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { categoryService } from "@/features/categories/services/categoryService"
import { cn } from "@/lib/utils"
import { BookSearchParams } from "@/features/books/schemas/book-search"
import { Toggle } from "@/components/ui/toggle"
import Link from "next/link"
import { AsyncMultiCombobox } from "@/components/ui/async-multi-combobox"
import { ToolbarLayout } from "@/components/ui/toolbar-layout"

type BooksToolbarProps = {
  initialFilters: BookSearchParams
  searchQuery: string
  setSearchQueryAction: (val: string) => void
  minPrice: string
  setMinPriceAction: (val: string) => void
  maxPrice: string
  setMaxPriceAction: (val: string) => void
  setCategoryIdsAction: (ids: number[]) => void
  setAvailableAction: (val: boolean | null) => void
  applyPriceFilterAction: () => void
  resetFiltersAction: () => void
  hasActiveFilters: boolean
}

export function BooksToolbar({ 
  initialFilters,
  searchQuery,
  setSearchQueryAction,
  minPrice,
  setMinPriceAction,
  maxPrice,
  setMaxPriceAction,
  setCategoryIdsAction,
  setAvailableAction,
  applyPriceFilterAction,
  resetFiltersAction,
  hasActiveFilters
}: BooksToolbarProps) {
  const maxPriceInputRef = useRef<HTMLInputElement>(null)

  return (
    <ToolbarLayout
      filters={
        <>
          <div className="relative w-full sm:w-64 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQueryAction(e.target.value)}
            />
          </div>

          {/* Available Toggle */}
          <Toggle
              variant="outline"
              size="sm"
              className={cn("h-9 gap-2", initialFilters.available ? "border-primary bg-primary/10 hover:bg-primary/20" : "hover:bg-muted")}
              pressed={initialFilters.available}
              onPressedChange={(pressed) => setAvailableAction(pressed ? true : null)}
          >
            {initialFilters.available ? (
                <CheckCircle2 className="h-4 w-4" />
            ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            Available
          </Toggle>

          {/* Price Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 gap-2", (initialFilters.minPrice || initialFilters.maxPrice) ? "border-primary text-primary bg-primary/10" : "")}>
                <DollarSign className="h-4 w-4" />
                {initialFilters.minPrice || initialFilters.maxPrice
                    ? `${initialFilters.minPrice || 0} - ${initialFilters.maxPrice || '∞'}`
                    : "Price"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-4">
              <div className="grid gap-4" onKeyDown={(e) => e.key === 'Enter' && applyPriceFilterAction()}>
                <div className="space-y-1">
                  <h4 className="font-medium">Price Range</h4>
                  <p className="text-xs text-muted-foreground">Press Enter to apply</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPriceAction(e.target.value)}
                      className="h-8"
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' && !e.shiftKey) {
                          e.preventDefault()
                          maxPriceInputRef.current?.focus()
                        }
                      }}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                      ref={maxPriceInputRef}
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPriceAction(e.target.value)}
                      className="h-8"
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setMinPriceAction("")
                    setMaxPriceAction("")
                    applyPriceFilterAction()
                  }}>Reset</Button>
                  <Button size="sm" onClick={applyPriceFilterAction}>Apply</Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <div className="w-full sm:w-72">
            <AsyncMultiCombobox
              value={initialFilters.categoryIds || []}
              onChange={(ids) => setCategoryIdsAction(ids.map(Number))}
              fetchOptions={async (search) => {
                const res = await categoryService.getAll({ name: search })
                return res.content || []
              }}
              mapOption={(item) => ({
                value: item.id!,
                label: item.name!
              })}
              placeholder="Filter categories..."
              searchPlaceholder="Search categories..."
              className="h-9"
            />
          </div>

          {/* Clear All Button */}
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
      actions={
        <Button asChild className="h-9">
          <Link href="/dashboard/books/new">
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Link>
        </Button>
      }
    />
  )
}
