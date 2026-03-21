"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LayoutGrid, Grid3X3, Grid2X2, Settings2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sizeOptions = [
  { value: "12", label: "12 items" },
  { value: "24", label: "24 items" },
  { value: "48", label: "48 items" },
]

export function BookViewOptions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const size = searchParams.get("size") || "12"
  const cols = searchParams.get("cols") || "4"

  const handleParamChange = (key: string, value: string, resetPage = false) => {
    const current = searchParams.get(key) || (key === "size" ? "12" : "4")
    if (current === value) return

    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set(key, value)
      if (resetPage) newSearchParams.delete("page")
      
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    })
  }

  return (
    <div className={cn("flex items-center gap-1", isPending && "opacity-70 pointer-events-none")}>
      
      {/* Grid Columns Toggle (Desktop/Tablet) */}
      <div className="hidden sm:flex items-center bg-muted/50 p-1 rounded-lg border border-border shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-8 rounded-md transition-all", 
            cols === "2" ? "bg-background text-emerald-700 dark:text-emerald-400 shadow-sm font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => handleParamChange("cols", "2")}
          title="2 Columns"
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-8 rounded-md transition-all", 
            cols === "3" ? "bg-background text-emerald-700 dark:text-emerald-400 shadow-sm font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => handleParamChange("cols", "3")}
          title="3 Columns"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-8 rounded-md transition-all", 
            cols === "4" ? "bg-background text-emerald-700 dark:text-emerald-400 shadow-sm font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => handleParamChange("cols", "4")}
          title="4 Columns"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Dropdown (Items per page & Mobile grid toggle) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9 shrink-0 shadow-sm border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors rounded-lg sm:ml-1"
            title="View Settings"
          >
            <Settings2 className="h-4 w-4" />
            <span className="sr-only">View Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] p-2 rounded-xl shadow-lg border-border">
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold py-1.5 px-2">
                Items Per Page
            </DropdownMenuLabel>
            {sizeOptions.map((option) => {
              const isSelected = size === option.value
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleParamChange("size", option.value, true)}
                  className={cn(
                    "rounded-md px-2 py-1.5 cursor-pointer text-sm mb-0.5",
                    isSelected ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          {/* Mobile Grid Options (Only shown on small screens where inline buttons are hidden) */}
          <div className="sm:hidden">
            <DropdownMenuSeparator className="my-1.5 bg-border" />
            <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold py-1.5 px-2">
                    Grid View
                </DropdownMenuLabel>
                {[
                    { val: "1", icon: LayoutGrid, label: "1 Column (List)" },
                    { val: "2", icon: Grid2X2, label: "2 Columns" }
                ].map((opt) => {
                    const isSelected = cols === opt.val || (opt.val === "1" && !["2","3","4"].includes(cols))
                    return (
                        <DropdownMenuItem
                            key={opt.val}
                            onClick={() => handleParamChange("cols", opt.val)}
                            className={cn(
                                "rounded-md px-2 py-1.5 cursor-pointer text-sm mb-0.5",
                                isSelected ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <opt.icon className="h-3.5 w-3.5 mr-2 opacity-70" />
                            <span className="flex-1">{opt.label}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuGroup>
          </div>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
