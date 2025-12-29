"use client"

import * as React from "react"
import { Check, Search, Loader2, ChevronDown } from "lucide-react"
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

export function CategoryDropdown2({ categories, selectedIds, onToggle, isLoading }: any) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    // Optimistic UI for instant checkbox feedback
    const [optimisticIds, setOptimisticIds] = React.useState<number[]>(selectedIds)
    React.useEffect(() => setOptimisticIds(selectedIds), [selectedIds])

    // Only show top 20 when there is no search query to keep the initial render fast
    const displayedCategories = React.useMemo(() => {
        if (searchValue.trim() !== "") return categories; // Show all to the internal search engine
        return categories.slice(0, 20); // Show only top 20 initially
    }, [categories, searchValue]);

    const handleSelect = (id: number) => {
        const nextIds = optimisticIds.includes(id)
            ? optimisticIds.filter(i => i !== id)
            : [...optimisticIds, id]
        setOptimisticIds(nextIds)
        onToggle(id)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full sm:w-72 h-9 justify-between font-normal px-3",
                        selectedIds.length > 0 && "border-primary/50 bg-primary/5 text-primary"
                    )}
                >
                    <div className="flex items-center gap-2 truncate">
                        <Search className="h-4 w-4 opacity-50" />
                        <span className="truncate">
              {selectedIds.length > 0
                  ? `${selectedIds.length} Selected`
                  : "Search category..."}
            </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={true}>
                    <CommandInput
                        placeholder="Type to search 300+ categories..."
                        onValueChange={setSearchValue}
                    />
                    <CommandList className="max-h-[300px]">
                        {isLoading ? (
                            <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin" /></div>
                        ) : (
                            <>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading={searchValue === "" ? "Top Categories" : "Results"}>
                                    {displayedCategories.map((category: any) => {
                                        const isSelected = optimisticIds.includes(category.id)
                                        return (
                                            <CommandItem
                                                key={category.id}
                                                value={`${category.name} ${category.id}`}
                                                onSelect={() => handleSelect(category.id)}
                                                className="cursor-pointer data-[disabled]:opacity-100 data-[disabled]:pointer-events-auto"
                                            >
                                                <div className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected ? "bg-primary text-primary-foreground" : "opacity-40"
                                                )}>
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                                <span className="flex-1 truncate">{category.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">#{category.id}</span>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}