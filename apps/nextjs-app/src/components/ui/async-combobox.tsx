"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
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

export interface Option {
  value: string | number
  label: string
}

/**
 * Props for the AsyncCombobox component.
 * @template T The type of the data item.
 */
interface AsyncComboboxProps<T> {
  /** The currently selected value (ID). */
  value?: string | number
  /** Callback fired when the selection changes. */
  onChange: (value: string | number | undefined) => void
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
  /** Initial data to populate the cache/selection before fetching. */
  initialData?: T[]
  /** Whether the combobox is disabled. */
  disabled?: boolean
  /** Delay in milliseconds before fetching options. Defaults to 300ms. */
  debounceDelay?: number
}

/**
 * A single-select combobox that fetches data asynchronously.
 * Features: Debounced search, caching, and custom rendering.
 */
export function AsyncCombobox<T>({
  value,
  onChange,
  fetchOptions,
  mapOption,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
  renderOption,
  initialData = [],
  disabled,
  debounceDelay = 300,
}: AsyncComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [options, setOptions] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(false)

  // We store the full selected object here to ensure we can display its label
  // even if it's not present in the current search results.
  const [selectedItem, setSelectedItem] = React.useState<T | undefined>(undefined)
  
  // Debounce the search term to prevent excessive API calls while typing.
  // Waits 300ms after the last keystroke.
  const debouncedSearch = useDebounce(search, debounceDelay)

  // Cache for storing search results to avoid refetching the same query.
  // Key: search query, Value: array of results.
  const cache = React.useRef<Map<string, T[]>>(new Map())

  // Track the previous fetch function to detect if the parent passed a new reference.
  const prevFetchOptions = React.useRef(fetchOptions)

  // CRITICAL: Reset cache if the fetchOptions function reference changes.
  // This is why passing a stable function (via useCallback) is important.
  React.useEffect(() => {
    if (prevFetchOptions.current !== fetchOptions) {
      cache.current.clear()
      prevFetchOptions.current = fetchOptions
    }
  }, [fetchOptions])

  // CRITICAL: Synchronize internal selectedItem state with the external `value` prop.
  //
  // WHY IS THIS NEEDED?
  // The `value` prop only holds the ID (e.g., "123"). To display the label (e.g., "Harry Potter"),
  // we need the full object. This effect hunts down that full object whenever:
  // 1. The `value` changes (parent updates selection).
  // 2. We get new `options` (maybe the selected item is in the new search results).
  // 3. We get `initialData` (maybe the selected item is there).
  //
  // TODO: Handle "Pre-selected Value without Data" case.
  // If the component mounts with a `value` (e.g. from URL params) but `initialData` is empty,
  // we currently don't have the label for that value.
  // Solution: Add a `fetchById` prop to resolve the initial value's label, or ensure
  // the parent component passes the full object in `initialData`.
  React.useEffect(() => {
    if (!value) {
      setSelectedItem(undefined)
      return
    }

    // Search Strategy:
    // 1. Check current search results (`options`).
    // 2. Check `initialData` (static list passed from parent).
    const option =
      options.find((item) => mapOption(item).value === value) ||
      initialData.find((item) => mapOption(item).value === value)

    // If we found the full object, save it!
    // This ensures that even if the user searches for something else later (clearing `options`),
    // we still remember "Harry Potter" is the selected item.
    if (option) {
      setSelectedItem(option)
    }
  }, [value, options, initialData, mapOption])

  // Fetch options when the debounced search term changes or the menu opens.
  React.useEffect(() => {
    if (!open) return

    const query = debouncedSearch.trim()
    
    // Check cache first to avoid network request
    if (cache.current.has(query)) {
      setOptions(cache.current.get(query)!)
      return
    }

    let active = true
    setLoading(true)

    const loadOptions = async () => {
      try {
        const results = await fetchOptions(query)
        // Prevent race conditions: only update state if this effect is still active
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

  // Derived state for the currently selected item to display in the trigger.
  const currentSelectedItem = React.useMemo(() => {
    if (selectedItem && mapOption(selectedItem).value === value) {
      return selectedItem
    }
    return undefined
  }, [selectedItem, value, mapOption])

  const selectedOption = currentSelectedItem ? mapOption(currentSelectedItem) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
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
                  const isSelected = value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange(option.value === value ? undefined : option.value)
                        setOpen(false)
                      }}
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
  )
}
