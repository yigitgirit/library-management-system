"use client"

import * as React from "react"
import {BookSearch} from "./book-search"
import {BookSort} from "./book-sort"
import {BookViewOptions} from "./book-view-options"
import {cn} from "@/lib/utils"

export function DesktopToolbar({ searchKey }: { searchKey?: string }) {
  const [isSticky, setIsSticky] = React.useState(false)

  React.useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 80)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className={cn(
        "flex flex-row gap-4 items-center justify-between w-full transition-[padding] duration-500 ease-in-out",
        isSticky ? "px-6" : "px-0"
      )}
    >
      <div className="flex-1 min-w-0 max-w-xl">
        <BookSearch key={searchKey} />
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <BookSort />
        <div className="w-px h-6 bg-border" />
        <BookViewOptions />
      </div>
    </div>
  )
}
