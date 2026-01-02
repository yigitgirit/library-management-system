"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/features/common/hooks/use-debounce"

type SearchBaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string
  onValueChange: (val: string) => void
  onClear: () => void
  containerClassName?: string
}

// Internal Base Component for consistent styling
const SearchBase = React.forwardRef<HTMLInputElement, SearchBaseProps>(
  ({ className, containerClassName, value, onValueChange, onClear, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className={cn(
            "w-full pl-9 h-9 [&::-webkit-search-cancel-button]:hidden",
            value && "pr-9",
            className
          )}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          {...props}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-9 hover:bg-transparent"
            onClick={onClear}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    )
  }
)
SearchBase.displayName = "SearchBase"

// 1. URL-Driven Search (Debounced)
// Syncs input with URL query params. Good for shareable lists.
export function UrlSearch({
  className,
  containerClassName,
  paramName = "search",
  debounceMs = 800,
  resetParams = ["page"],
  ...props
}: Omit<SearchBaseProps, "value" | "onValueChange" | "onClear"> & {
  paramName?: string
  debounceMs?: number
  resetParams?: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get(paramName) || ""
  const [query, setQuery] = React.useState(initialSearch)
  const debouncedQuery = useDebounce(query, debounceMs)

  // Stable reference for resetParams to avoid effect loops
  const resetParamsJson = JSON.stringify(resetParams)
  const stableResetParams = React.useMemo(() => JSON.parse(resetParamsJson) as string[], [resetParamsJson])

  React.useEffect(() => {
    setQuery(initialSearch)
  }, [initialSearch])

  React.useEffect(() => {
    const currentSearch = searchParams.get(paramName) || ""
    if (debouncedQuery !== currentSearch) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (debouncedQuery) {
        newSearchParams.set(paramName, debouncedQuery)
      } else {
        newSearchParams.delete(paramName)
      }
      stableResetParams.forEach((p) => newSearchParams.delete(p))
      
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    }
  }, [debouncedQuery, router, searchParams, paramName, stableResetParams])

  return (
    <SearchBase
      value={query}
      onValueChange={setQuery}
      onClear={() => setQuery("")}
      containerClassName={cn("w-full sm:max-w-sm", containerClassName, className)}
      className={className}
      name={paramName}
      {...props}
    />
  )
}

// 5. URL-Driven Search (Submit)
// Syncs input with URL query params on Enter. Good for heavy queries.
export function UrlSubmitSearch({
  className,
  containerClassName,
  paramName = "search",
  resetParams = ["page"],
  ...props
}: Omit<SearchBaseProps, "value" | "onValueChange" | "onClear"> & {
  paramName?: string
  resetParams?: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get(paramName) || ""
  const [query, setQuery] = React.useState(initialSearch)

  // Stable reference for resetParams to avoid effect loops
  const resetParamsJson = JSON.stringify(resetParams)
  const stableResetParams = React.useMemo(() => JSON.parse(resetParamsJson) as string[], [resetParamsJson])

  React.useEffect(() => {
    setQuery(initialSearch)
  }, [initialSearch])

  const onSearch = (val: string) => {
    const currentSearch = searchParams.get(paramName) || ""
    if (val !== currentSearch) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (val) {
        newSearchParams.set(paramName, val)
      } else {
        newSearchParams.delete(paramName)
      }
      stableResetParams.forEach((p) => newSearchParams.delete(p))
      
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className={cn("w-full sm:max-w-sm", containerClassName, className)}>
      <SearchBase
        value={query}
        onValueChange={setQuery}
        onClear={() => { setQuery(""); onSearch(""); }}
        className={cn("w-full", className)}
        name={paramName}
        {...props}
      />
    </form>
  )
}

// 2. Callback-Driven Search (Debounced)
// Local state, notifies parent after delay. Good for client-side filtering.
export function DebouncedSearch({
  className,
  containerClassName,
  onSearch,
  debounceMs = 500,
  initialValue = "",
  ...props
}: Omit<SearchBaseProps, "value" | "onValueChange" | "onClear"> & {
  onSearch: (val: string) => void
  debounceMs?: number
  initialValue?: string
}) {
  const [query, setQuery] = React.useState(initialValue)
  const debouncedQuery = useDebounce(query, debounceMs)

  React.useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <SearchBase
      value={query}
      onValueChange={setQuery}
      onClear={() => setQuery("")}
      containerClassName={cn("w-full sm:max-w-sm", containerClassName, className)}
      className={className}
      {...props}
    />
  )
}

// 3. Submit-Driven Search
// Triggers only on Enter or Button click. Good for heavy queries.
export function SubmitSearch({
  className,
  containerClassName,
  onSearch,
  initialValue = "",
  ...props
}: Omit<SearchBaseProps, "value" | "onValueChange" | "onClear"> & {
  onSearch: (val: string) => void
  initialValue?: string
}) {
  const [query, setQuery] = React.useState(initialValue)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full sm:max-w-sm", containerClassName, className)}>
      <SearchBase
        value={query}
        onValueChange={setQuery}
        onClear={() => {
          setQuery("")
          onSearch("")
        }}
        className={cn("w-full", className)}
        {...props}
      />
    </form>
  )
}

// 4. Instant Search (Controlled)
// Triggers immediately. Good for small lists.
export function InstantSearch({
  className,
  containerClassName,
  value,
  onValueChange,
  ...props
}: Omit<SearchBaseProps, "onClear">) {
  return (
    <SearchBase
      value={value}
      onValueChange={onValueChange}
      onClear={() => onValueChange("")}
      containerClassName={cn("w-full sm:max-w-sm", containerClassName, className)}
      className={className}
      {...props}
    />
  )
}