"use client"

import { Button } from "@/components/ui/button"

type ReviewsToolbarProps = {
  resetFiltersAction: () => void
}

export function ReviewsToolbar({ resetFiltersAction }: ReviewsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold">Filters</h3>
        <p className="text-sm text-muted-foreground">Manage all book reviews</p>
      </div>
      <Button variant="outline" onClick={resetFiltersAction}>
        Reset Filters
      </Button>
    </div>
  )
}

