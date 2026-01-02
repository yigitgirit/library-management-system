"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

const sortOptions = [
  { value: "title,asc", label: "Title (A-Z)" },
  { value: "title,desc", label: "Title (Z-A)" },
  { value: "createdAt,desc", label: "Newest First" },
  { value: "createdAt,asc", label: "Oldest First" },
]

export function BookSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort") || "title,asc"

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("sort", value)
    newSearchParams.delete("page")
    
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
