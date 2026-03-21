"use client"

import { memo, useCallback, useState, useTransition, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { categoryQueries } from "@/features/categories/api/categoryQueries"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InstantSearch } from "@/components/ui/search"

// --- Helper Functions ---

function updateSearchParams(
  currentParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, string | string[] | null>
): string {
  const newParams = new URLSearchParams(currentParams.toString())

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key)
    } else if (Array.isArray(value)) {
      newParams.delete(key)
      value.forEach(v => newParams.append(key, v))
    } else {
      newParams.set(key, value)
    }
  })

  newParams.delete("page")

  return newParams.toString()
}

// --- Memoized Subcomponents ---

const FilterHeader = memo(function FilterHeader({ 
  hasFilters, 
  onClear
}: { 
  hasFilters: boolean, 
  onClear: () => void
}) {
  return (
    <div className="flex items-center justify-between py-2 mb-2 h-9">
      <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Filters</h3>
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors"
        >
          Clear all
        </Button>
      )}
    </div>
  )
})

const AvailabilityFilter = memo(function AvailabilityFilter({ 
  checked, 
  onChange 
}: { 
  checked: boolean, 
  onChange: (checked: boolean) => void 
}) {
  return (
    <div className="flex items-start space-x-3 py-4 group">
      <Checkbox 
        id="in-stock" 
        checked={checked}
        onCheckedChange={(c) => onChange(c as boolean)}
        className="mt-0.5 rounded-[4px] border-slate-300 dark:border-slate-700 data-[state=checked]:bg-emerald-700 dark:data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-700 dark:data-[state=checked]:border-emerald-600 transition-colors"
      />
      <div className="grid gap-1.5 leading-none">
        <Label 
          htmlFor="in-stock" 
          className="text-sm font-medium text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 cursor-pointer transition-colors"
        >
          In stock only
        </Label>
        <p className="text-xs text-muted-foreground">
          Show books currently available
        </p>
      </div>
    </div>
  )
})

const CategorySearch = memo(function CategorySearch({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="mb-4">
      <InstantSearch
        placeholder="Find category..."
        value={value}
        onValueChange={onChange}
        containerClassName="w-full"
        className="h-9 text-sm bg-muted/50 border-border hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-1 focus-visible:ring-emerald-700/50 dark:focus-visible:ring-emerald-500/50 focus-visible:border-emerald-700 dark:focus-visible:border-emerald-500 shadow-sm transition-all rounded-lg placeholder:text-muted-foreground font-medium"
      />
    </div>
  )
})

const CategoryList = memo(function CategoryList({
  categories,
  selectedIds,
  onToggle,
  isLoading,
  isError
}: {
  categories: { id: number, name: string }[],
  selectedIds: string[],
  onToggle: (id: string, checked: boolean) => void,
  isLoading: boolean,
  isError: boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 mt-2 px-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
             <Skeleton className="h-4 w-4 rounded-[4px]" />
             <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-6 mx-1 text-center border border-dashed border-border rounded-lg bg-muted/30">
        <p className="text-xs text-muted-foreground font-medium">Unable to load categories.</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="py-6 mx-1 text-center border border-dashed border-border rounded-lg bg-muted/30">
        <p className="text-xs text-muted-foreground font-medium">No categories found.</p>
      </div>
    )
  }

  return (
    <div className="max-h-[320px] overflow-y-auto space-y-1 pr-3 pl-1 custom-scrollbar">
      {categories.map((category) => {
        const idStr = category.id.toString()
        const isSelected = selectedIds.includes(idStr)
        
        return (
          <div 
            key={category.id} 
            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => onToggle(idStr, !isSelected)}
          >
            <Checkbox 
              id={`cat-${category.id}`} 
              checked={isSelected}
              onCheckedChange={(checked) => onToggle(idStr, checked as boolean)}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 rounded-[4px] border-slate-300 dark:border-slate-700 data-[state=checked]:bg-emerald-700 dark:data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-700 dark:data-[state=checked]:border-emerald-600 transition-colors shadow-sm"
            />
            <Label 
              htmlFor={`cat-${category.id}`} 
              className={cn(
                "text-sm cursor-pointer leading-snug select-none transition-colors w-full",
                isSelected ? "text-foreground font-semibold" : "text-muted-foreground font-medium group-hover:text-foreground"
              )}
              onClick={(e) => e.preventDefault()}
            >
              {category.name}
            </Label>
          </div>
        )
      })}
    </div>
  )
})

// --- Main Component ---

export function BookFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [categorySearch, setCategorySearch] = useState("")

  const selectedCategories = useMemo(() => searchParams.getAll("categoryIds"), [searchParams])
  const inStockOnly = searchParams.get("available") === "true"

  const { data: categoriesData, isLoading, isError } = useQuery({
    ...categoryQueries.list({page: 0, size: 50}),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const filteredCategories = useMemo(() => {
    const categories = categoriesData?.content || []
    if (!categorySearch.trim()) return categories
    
    const query = categorySearch.toLowerCase()
    return categories.filter(c => c.name.toLowerCase().includes(query))
  }, [categoriesData?.content, categorySearch])

  const navigateToUpdates = useCallback((updates: Record<string, string | string[] | null>) => {
    startTransition(() => {
      const newQueryString = updateSearchParams(searchParams, updates)
      router.push(`?${newQueryString}`, { scroll: false })
    })
  }, [searchParams, router])

  const handleCategoryToggle = useCallback((categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId)
      
    navigateToUpdates({ categoryIds: newCategories.length ? newCategories : null })
  }, [selectedCategories, navigateToUpdates])

  const handleInStockChange = useCallback((checked: boolean) => {
    navigateToUpdates({ available: checked ? "true" : null })
  }, [navigateToUpdates])

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete("categoryIds")
      newParams.delete("available")
      
      // Preserve pagination if we clear everything, but we probably want to reset it since items changed
      newParams.delete("page")
      
      router.push(`?${newParams.toString()}`, { scroll: false })
      setCategorySearch("")
    })
  }, [searchParams, router])

  const hasFilters = selectedCategories.length > 0 || inStockOnly

  return (
    <div className={cn(
        "space-y-1 w-full", 
        isPending && "opacity-60 pointer-events-none transition-opacity duration-300"
    )}>
      <div className="h-9 mb-2">
        <FilterHeader 
          hasFilters={hasFilters} 
          onClear={handleClearFilters}
        />
      </div>
      
      <Accordion type="multiple" defaultValue={["availability", "categories"]} className="w-full">
        
        <AccordionItem value="availability" className="border-b border-border">
            <AccordionTrigger className="hover:no-underline py-4 text-sm font-semibold text-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                Availability
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-4">
                <AvailabilityFilter checked={inStockOnly} onChange={handleInStockChange} />
            </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="categories" className="border-b border-border">
            <AccordionTrigger className="hover:no-underline py-4 text-sm font-semibold text-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                <div className="flex items-center gap-2">
                  Categories
                  {selectedCategories.length > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      {selectedCategories.length}
                    </span>
                  )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 px-[1px]">
                <CategorySearch value={categorySearch} onChange={setCategorySearch} />
                <CategoryList 
                    categories={filteredCategories}
                    selectedIds={selectedCategories}
                    onToggle={handleCategoryToggle}
                    isLoading={isLoading}
                    isError={isError}
                />
            </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}
