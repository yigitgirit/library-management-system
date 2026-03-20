"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const rating = i + 1
        const isFilled = rating <= value

        return (
          <button
            key={i}
            type="button"
            onClick={() => !readonly && onChange(rating)}
            disabled={disabled || readonly}
            className={cn(
              "relative inline-flex items-center justify-center transition-colors",
              disabled || readonly ? "cursor-default opacity-50" : "cursor-pointer hover:opacity-70"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm font-medium text-muted-foreground">{value}/5</span>
    </div>
  )
}

