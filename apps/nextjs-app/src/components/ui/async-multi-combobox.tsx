"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "@/features/common/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"

export interface Option {
  value: string | number
  label: string
}

/**
 * Props for the AsyncMultiCombobox component.
 * @template T The type of the data item.
 */
interface AsyncMultiComboboxProps<T> {
  /** The currently selected values (IDs). */
  value?: (string | number)[]
  /** Callback fired when the selection changes. */
  onChange: (value: (string | number)[]) => void
  /**
   * Function to fetch options based on a search query.
   * Should return a Promise that resolves to an array of items.
   * IMPORTANT: Wrap this in useCallback to prevent infinite loops/cache clearing.
   */
  fetchOptions: (search: string) => Promise<T[]>
  /** Helper function to convert a data item to a standard Option (value/label). */
  mapOption: (item: T) => Option
  /** Placeholder text for the trigger button. */
  placeholder?: string
  /** Placeholder text for the search input. */
  searchPlaceholder?: string
  /** Message to display when no options are found. */
  emptyMessage?: string
  /** Additional CSS classes for the trigger button. */
  className?: string
  /** Custom renderer for options in the dropdown. */
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode
  /** Custom renderer for the selected item tags/badges. */
  renderTag?: (item: T, onRemove: () => void) => React.ReactNode
  /** Initial data to populate the cache/selection before fetching. */
  initialData?: T[]
  /** Whether the combobox is disabled. */
  disabled?: boolean
  /** Delay in milliseconds before fetching options. Defaults to 300ms. */
  debounceDelay?: number
}

/**
 * A multi-select combobox that fetches data asynchronously.
 * Features: Debounced search, caching, custom rendering, and tag management.
 */
export function AsyncMultiCombobox<T>({
  value = [],
  onChange,
  fetchOptions,
  mapOption,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
  renderOption,
  renderTag,
  initialData = [],
  disabled,
  debounceDelay = 300,
}: AsyncMultiComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [options, setOptions] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(false)
  
  // Map to store full objects of selected items.
  // This is crucial for displaying tags for items that might not be in the current search results.
  const [selectedItemsMap, setSelectedItemsMap] = React.useState<Map<string | number, T>>(new Map())
  
  // Debounce the search term to prevent excessive API calls.
  const debouncedSearch = useDebounce(search, debounceDelay)
  
  // Cache for storing search results.
  const cache = React.useRef<Map<string, T[]>>(new Map())
  const prevFetchOptions = React.useRef(fetchOptions)

  // CRITICAL: Reset cache if the fetchOptions function reference changes.
  React.useEffect(() => {
    if (prevFetchOptions.current !== fetchOptions) {
      cache.current.clear()
      prevFetchOptions.current = fetchOptions
    }
  }, [fetchOptions])

  // CRITICAL: Synchronize selectedItemsMap with the external `value` prop.
  // 
  // WHY IS THIS NEEDED?
  // The `value` prop is just an array of IDs (e.g., [1, 2]). To display tags (e.g., "Apple", "Banana"),
  // we need the full objects. This effect ensures `selectedItemsMap` contains the full objects
  // for every ID in `value`.
  //
  // TODO: Handle "Pre-selected Value without Data" case.
  // If the component mounts with a `value` (e.g. from URL params) but `initialData` is empty,
  // we currently don't have the label for that value.
  // Solution: Add a `fetchByIds` prop to resolve the initial values' labels, or ensure
  // the parent component passes the full objects in `initialData`.
  React.useEffect(() => {
    const newMap = new Map(selectedItemsMap)
    let hasChanges = false

    // Helper to add items to the map if they are selected
    const tryAddItem = (item: T) => {
      const option = mapOption(item)
      // If this item is in the selected `value` array AND we don't have it in our map yet...
      if (value.includes(option.value) && !newMap.has(option.value)) {
        newMap.set(option.value, item) // ...add it!
        hasChanges = true
      }
    }

    // 1. Check `initialData` (static list passed from parent)
    initialData.forEach(tryAddItem)

    // 2. Check current search results (`options`)
    options.forEach(tryAddItem)

    // 3. Cleanup: Remove items from the map that are no longer in the `value` array
    // (e.g., if the parent component cleared the selection)
    for (const key of newMap.keys()) {
      if (!value.includes(key)) {
        newMap.delete(key)
        hasChanges = true
      }
    }

    if (hasChanges) {
      setSelectedItemsMap(newMap)
    }
  }, [value, options, initialData, mapOption, selectedItemsMap])

  // Fetch options when debounced search changes
  React.useEffect(() => {
    if (!open) return

    const query = debouncedSearch.trim()
    
    if (cache.current.has(query)) {
      setOptions(cache.current.get(query)!)
      return
    }

    let active = true
    setLoading(true)

    const loadOptions = async () => {
      try {
        const results = await fetchOptions(query)
        if (active) {
          cache.current.set(query, results)
          setOptions(results)
        }
      } catch (error) {
        console.error("Failed to fetch options:", error)
        if (active) setOptions([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadOptions()

    return () => {
      active = false
    }
  }, [open, debouncedSearch, fetchOptions])

  const handleSelect = (itemValue: string | number) => {
    const newValue = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue]
    onChange(newValue)
  }

  // Derived list of selected items for rendering tags
  const selectedItems = React.useMemo(() => {
    return value.map(v => selectedItemsMap.get(v)).filter(Boolean) as T[]
  }, [value, selectedItemsMap])

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", value.length === 0 && "text-muted-foreground", className)}
            disabled={disabled}
          >
            <span className="truncate">
              {value.length > 0 ? `${value.length} selected` : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder={searchPlaceholder} 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!loading && options.length === 0 && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
              {!loading && (
                <CommandGroup>
                  {options.map((item) => {
                    const option = mapOption(item)
                    const isSelected = value.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                      >
                        {renderOption ? (
                          renderOption(item, isSelected)
                        ) : (
                          <>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Render selected item tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => {
            const option = mapOption(item)
            if (renderTag) {
              return renderTag(item, () => handleSelect(option.value))
            }
            return (
              <Badge key={option.value} variant="secondary" className="flex items-center gap-1">
                {option.label}
                <button
                  type="button"
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSelect(option.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleSelect(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  <span className="sr-only">Remove {option.label}</span>
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
