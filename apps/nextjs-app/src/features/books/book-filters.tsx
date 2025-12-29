"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { bookService } from "@/lib/books/service"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

export function BookFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categorySearch, setCategorySearch] = useState("")
  
  // Read state from URL
  const selectedCategories = searchParams.getAll("categoryIds")
  const inStockOnly = searchParams.get("available") === "true"

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: bookService.getCategories
  })

  const categories = categoriesData?.content || []

  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // Helper to update URL
  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else if (Array.isArray(value)) {
          newSearchParams.delete(key)
          value.forEach(v => newSearchParams.append(key, v))
        } else {
          newSearchParams.set(key, value)
        }
      })
      
      // Reset page when filters change
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    let newCategories: string[]
    if (checked) {
      newCategories = [...selectedCategories, categoryId]
    } else {
      newCategories = selectedCategories.filter(id => id !== categoryId)
    }
    
    router.push(`?${createQueryString({ categoryIds: newCategories })}`, { scroll: false })
  }

  const handleInStockChange = (checked: boolean) => {
    router.push(`?${createQueryString({ available: checked ? "true" : null })}`, { scroll: false })
  }

  const handleClearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("categoryIds")
    newSearchParams.delete("available")
    newSearchParams.delete("search")
    newSearchParams.delete("page")
    newSearchParams.delete("sort")
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  const hasFilters = selectedCategories.length > 0 || inStockOnly

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between h-8">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Separator />

      {/* Availability Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Availability</h4>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={inStockOnly}
            onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Categories</h4>
        
        {/* Category Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className={cn("h-8 pl-8 text-xs", categorySearch && "pr-8")}
          />
          {categorySearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent"
              onClick={() => setCategorySearch("")}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden pr-2 -mr-2 space-y-3">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category.id}`} 
                    checked={selectedCategories.includes(category.id.toString())}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id.toString(), checked as boolean)}
                  />
                  <Label htmlFor={`cat-${category.id}`} className="text-sm font-normal cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-2 text-center">No categories found</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
