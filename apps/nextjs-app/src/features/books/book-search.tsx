"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

export function BookSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const [query, setQuery] = useState(initialSearch)
  const debouncedQuery = useDebounce(query, 500)

  // Sync local state if URL changes externally (e.g. clear filters)
  useEffect(() => {
    setQuery(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    // Only update if the debounced query is different from the URL param
    // to avoid loops or unnecessary pushes
    const currentSearch = searchParams.get("search") || ""
    
    if (debouncedQuery !== currentSearch) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (debouncedQuery) {
        newSearchParams.set("search", debouncedQuery)
      } else {
        newSearchParams.delete("search")
      }
      newSearchParams.delete("page") // Reset page on search
      
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    }
  }, [debouncedQuery, router, searchParams])

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search books by title, author, ISBN..."
        className={cn(
          "w-full pl-9 h-9 [&::-webkit-search-cancel-button]:hidden", 
          query && "pr-9"
        )}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
          onClick={() => setQuery("")}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
