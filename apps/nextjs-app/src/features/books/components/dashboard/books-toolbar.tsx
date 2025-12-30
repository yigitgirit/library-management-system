"use client"

import {useCallback, useRef, useState} from "react"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
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
} from "@/features/common/components/ui/dropdown-menu"
import { CategoryControllerService } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { useEffect } from "react"
import {BookSearchParams} from "@/features/books/schemas/book-search";
import { Toggle } from "@/features/common/components/ui/toggle"
import Link from "next/link"
import { AsyncMultiCombobox } from "@/features/common/components/ui/async-multi-combobox"

type BooksToolbarProps = {
  initialFilters: BookSearchParams
}

export function BooksToolbar({ initialFilters }: BooksToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state for inputs
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
  const [localMinPrice, setLocalMinPrice] = useState(initialFilters.minPrice?.toString() || "")
  const [localMaxPrice, setLocalMaxPrice] = useState(initialFilters.maxPrice?.toString() || "")

  // Refs for focus management
  const maxPriceInputRef = useRef<HTMLInputElement>(null)

  // Debounce search update to URL
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Handlers
  const updateFilters = useCallback((updates: Record<string, string | string[] | number | number[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key)
        value.forEach(v => params.append(key, v.toString()))
      } else {
        params.set(key, value.toString())
      }
    })

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, router, pathname])

  // Sync URL with debounced search
  useEffect(() => {
    if (debouncedSearch !== (initialFilters.search ?? "")) {
      updateFilters({ search: debouncedSearch || null });
    }
  }, [debouncedSearch, initialFilters.search, updateFilters]);

  const handleCategoryChange = (categoryIds: (string | number)[]) => {
    updateFilters({ categoryIds: categoryIds.map(Number) })
  }

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: localMinPrice || null,
      maxPrice: localMaxPrice || null
    })
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setLocalMinPrice("")
    setLocalMaxPrice("")

    router.push(pathname, { scroll: false })
  }

  const hasActiveFilters = (initialFilters.categoryIds?.length ?? 0) > 0 ||
      initialFilters.available ||
      initialFilters.minPrice ||
      initialFilters.maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-64 h-9">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Available Toggle */}
          <Toggle
              variant="outline"
              size="sm"
              className={cn("h-9 gap-2", initialFilters.available ? "border-primary bg-primary/10 hover:bg-primary/20" : "hover:bg-muted")}
              pressed={initialFilters.available}
              onPressedChange={(pressed) => updateFilters({ available: pressed ? "true" : null })}
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
              <div className="grid gap-4" onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}>
                <div className="space-y-1">
                  <h4 className="font-medium">Price Range</h4>
                  <p className="text-xs text-muted-foreground">Press Enter to apply</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                      type="number"
                      placeholder="Min"
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
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
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="h-8"
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setLocalMinPrice("")
                    setLocalMaxPrice("")
                    updateFilters({ minPrice: null, maxPrice: null })
                  }}>Reset</Button>
                  <Button size="sm" onClick={applyPriceFilter}>Apply</Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <div className="w-full sm:w-72">
            <AsyncMultiCombobox
              value={initialFilters.categoryIds || []}
              onChange={handleCategoryChange}
              fetchOptions={async (search) => {
                const res = await CategoryControllerService.getCategories({name: search})
                return res.data?.content || []
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
                onClick={clearAllFilters}
            >
              Clear all
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>

        <Button asChild className="h-9">
          <Link href="/dashboard/books/new">
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Link>
        </Button>
      </div>
    </div>
  )
}
