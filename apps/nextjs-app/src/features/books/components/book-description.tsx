"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookDescriptionProps {
  description: string
  maxLength?: number
}

export function BookDescription({ description, maxLength = 500 }: BookDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const shouldTruncate = description.length > maxLength

  if (!shouldTruncate) {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h3 className="text-2xl font-semibold mb-4">About this book</h3>
        <p className="leading-relaxed text-lg text-muted-foreground whitespace-pre-wrap">
          {description}
        </p>
      </div>
    )
  }

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h3 className="text-2xl font-semibold mb-4">About this book</h3>
      <div className="relative">
        <p 
            className={cn(
                "leading-relaxed text-lg text-muted-foreground whitespace-pre-wrap transition-all duration-300",
                !isExpanded && "max-h-[240px] overflow-hidden mask-image-gradient"
            )}
            style={!isExpanded ? { WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' } : {}}
        >
          {description}
        </p>
      </div>
      
      <Button 
        variant="ghost" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 pl-0 hover:bg-transparent hover:text-primary font-medium"
      >
        {isExpanded ? (
            <span className="flex items-center gap-1">Show less <ChevronUp className="h-4 w-4" /></span>
        ) : (
            <span className="flex items-center gap-1">Read more <ChevronDown className="h-4 w-4" /></span>
        )}
      </Button>
    </div>
  )
}
