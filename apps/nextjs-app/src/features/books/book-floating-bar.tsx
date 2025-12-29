"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookFloatingBarProps {
  title: string
  coverUrl?: string
  location: string
}

export function BookFloatingBar({ title, coverUrl, location }: BookFloatingBarProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isClosed, setIsClosed] = React.useState(false)

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const show = window.scrollY > 500
          if (show !== isVisible) {
            setIsVisible(show)
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

  if (!isVisible || isClosed) return null

  return (
    <div className={cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500",
        "hidden md:block" // Hide on mobile if it takes too much space
    )}>
      <div className="bg-background/80 backdrop-blur-md border rounded-xl shadow-2xl p-4 flex items-center gap-4 relative overflow-hidden">
        
        {/* Close Button */}
        <button 
            onClick={() => setIsClosed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
            <X className="h-4 w-4" />
        </button>

        {/* Mini Cover */}
        <div className="relative h-16 w-12 shrink-0 rounded-md overflow-hidden border shadow-sm">
            {coverUrl ? (
                <Image 
                    src={coverUrl} 
                    alt={title} 
                    fill 
                    className="object-cover"
                    sizes="48px"
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs">
                    Book
                </div>
            )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate pr-4">{title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="truncate">{location}</span>
            </div>
        </div>

        {/* Action */}
        <Button size="icon" variant="outline" className="shrink-0 rounded-full h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary">
            <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
