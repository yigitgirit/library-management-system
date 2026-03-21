"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const sortOptions = [
  { value: "title,asc", label: "Title (A-Z)" },
  { value: "title,desc", label: "Title (Z-A)" },
  { value: "createdAt,desc", label: "Newest Arrivals" },
  { value: "createdAt,asc", label: "Oldest First" },
]

export function BookSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const currentSort = searchParams.get("sort") || "title,asc"
  const currentLabel = sortOptions.find(o => o.value === currentSort)?.label || "Sort by"

  const handleSortChange = (value: string) => {
    if (value === currentSort) return

    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("sort", value)
      newSearchParams.delete("page") // Reset to page 1
      
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox"
          className={cn(
            "w-full justify-between transition-all shadow-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground min-w-0",
            isPending && "opacity-70 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground hidden sm:inline-block font-normal shrink-0">Sort:</span>
            <span className="text-foreground truncate">{currentLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] p-1 rounded-xl shadow-lg border-border">
        {sortOptions.map((option) => {
          const isSelected = currentSort === option.value
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm",
                isSelected 
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between w-full">
                {option.label}
                {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
