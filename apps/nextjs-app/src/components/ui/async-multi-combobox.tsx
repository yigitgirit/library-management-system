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
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"

export interface Option {
  value: string | number
  label: string
}

interface AsyncMultiComboboxProps<T> {
  value?: (string | number)[]
  onChange: (value: (string | number)[]) => void
  fetchOptions: (search: string) => Promise<T[]>
  mapOption: (item: T) => Option
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode
  renderTag?: (item: T, onRemove: () => void) => React.ReactNode
  initialData?: T[]
}

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
}: AsyncMultiComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [options, setOptions] = React.useState<T[]>(initialData)
  const [loading, setLoading] = React.useState(false)
  const debouncedSearch = useDebounce(search, 300)

  // Fetch options when search changes
  React.useEffect(() => {
    let active = true

    const loadOptions = async () => {
      setLoading(true)
      try {
        const results = await fetchOptions(debouncedSearch)
        if (active) {
          setOptions(results)
        }
      } catch (error) {
        console.error("Failed to fetch options:", error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadOptions()

    return () => {
      active = false
    }
  }, [debouncedSearch, fetchOptions])

  // Find selected items from options or initialData
  // We need to keep track of selected items even if they are not in the current search results
  // So we might need to accumulate them or rely on initialData being passed correctly
  const selectedItems = React.useMemo(() => {
    const allOptions = [...options, ...initialData]
    // Deduplicate options by value
    const uniqueOptions = new Map()
    allOptions.forEach(item => {
      const opt = mapOption(item)
      if (!uniqueOptions.has(opt.value)) {
        uniqueOptions.set(opt.value, item)
      }
    })
    
    return value.map(v => uniqueOptions.get(v)).filter(Boolean) as T[]
  }, [value, options, initialData, mapOption])

  const handleSelect = (itemValue: string | number) => {
    const newValue = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue]
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", value.length === 0 && "text-muted-foreground", className)}
          >
            {value.length > 0 ? `${value.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
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
                                "mr-2 h-4 w-4",
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
