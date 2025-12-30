"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/features/common/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/features/common/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/common/components/ui/popover"
import { useDebounce } from "@/features/common/hooks/use-debounce"

export interface Option {
  value: string | number
  label: string
}

interface AsyncComboboxProps<T> {
  value?: string | number
  onChange: (value: string | number | undefined) => void
  fetchOptions: (search: string) => Promise<T[]>
  mapOption: (item: T) => Option
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode
  initialData?: T[]
}

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
}: AsyncComboboxProps<T>) {
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

  // Find selected item from options or initialData
  const selectedItem = React.useMemo(() => {
    if (!value) return undefined
    const allOptions = [...options, ...initialData]
    return allOptions.find((item) => mapOption(item).value === value)
  }, [value, options, initialData, mapOption])

  const selectedOption = selectedItem ? mapOption(selectedItem) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
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
  )
}
