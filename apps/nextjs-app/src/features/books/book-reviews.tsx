"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ChevronDown } from "lucide-react"

interface Review {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

interface BookReviewsProps {
  reviews: Review[]
}

export function BookReviews({ reviews }: BookReviewsProps) {
  const [visibleCount, setVisibleCount] = React.useState(3)
  
  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, reviews.length))
  }

  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = visibleCount < reviews.length

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Community Reviews ({reviews.length})</h3>
      <div className="grid gap-4">
        {visibleReviews.map((review) => (
          <Card key={review.id} className="bg-muted/30 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{review.user}</span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={showMore} className="gap-2">
                Show more reviews <ChevronDown className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  )
}
