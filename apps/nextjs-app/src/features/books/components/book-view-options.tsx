"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LayoutGrid, Grid3X3, Grid2X2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function BookViewOptions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const size = searchParams.get("size") || "12"
  const cols = searchParams.get("cols") || "4"

  const handleSizeChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("size", value)
    newSearchParams.delete("page") // Reset to page 1
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  const handleColsChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("cols", value)
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-4">
      {/* Grid Columns */}
      <div className="flex items-center border rounded-md bg-background">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 rounded-none rounded-l-md", cols === "2" && "bg-accent text-accent-foreground")}
          onClick={() => handleColsChange("2")}
          title="2 Columns"
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 rounded-none", cols === "3" && "bg-accent text-accent-foreground")}
          onClick={() => handleColsChange("3")}
          title="3 Columns"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 rounded-none rounded-r-md", cols === "4" && "bg-accent text-accent-foreground")}
          onClick={() => handleColsChange("4")}
          title="4 Columns"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {/* Items Per Page */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap hidden sm:inline-block">Per page:</span>
        <Select value={size} onValueChange={handleSizeChange}>
          <SelectTrigger className="h-9 w-[70px]">
            <SelectValue placeholder="12" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
