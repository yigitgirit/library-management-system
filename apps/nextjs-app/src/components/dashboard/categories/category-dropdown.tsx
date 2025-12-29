"use client"

import * as React from "react"
import { Check, Search, Loader2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CategoryDropdown({ categories, selectedIds, onToggle, isLoading }: any) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [optimisticIds, setOptimisticIds] = React.useState<number[]>(selectedIds)

    React.useEffect(() => {
        setOptimisticIds(selectedIds)
    }, [selectedIds])

    const filteredCategories = React.useMemo(() => {
        return categories.filter((c: any) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [categories, searchTerm])

    const handleToggle = (id: number) => {
        const nextIds = optimisticIds.includes(id)
            ? optimisticIds.filter(i => i !== id)
            : [...optimisticIds, id]
        setOptimisticIds(nextIds)
        onToggle(id)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-72 h-9 justify-between px-3">
                    <div className="flex items-center gap-2 truncate">
                        <Search className="h-4 w-4 opacity-50" />
                        <span>{selectedIds.length > 0 ? `${selectedIds.length} Selected` : "Search category..."}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[300px] p-0 shadow-lg">
                <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
                    <Search className="mr-2 h-4 w-4 opacity-50" />
                    <input
                        className="h-8 w-full bg-transparent text-sm outline-none"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto p-1">
                    {isLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin h-4 w-4" /></div>
                    ) : (
                        filteredCategories.map((category: any) => {
                            const isSelected = optimisticIds.includes(category.id)
                            return (
                                <DropdownMenuItem
                                    key={category.id}
                                    onSelect={(e) => {
                                        e.preventDefault() // Crucial to keep menu open
                                        handleToggle(category.id)
                                    }}
                                    className="flex items-center gap-2 cursor-pointer data-[disabled]:opacity-100 data-[disabled]:pointer-events-auto"
                                >
                                    <div className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        isSelected ? "bg-primary text-primary-foreground" : "opacity-40"
                                    )}>
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <span className="flex-1 truncate">{category.name}</span>
                                </DropdownMenuItem>
                            )
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}