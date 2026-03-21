"use client"

import * as React from "react"
import {Filter} from "lucide-react"
import {BookSearch} from "./book-search"
import {BookSort} from "./book-sort"
import {BookViewOptions} from "./book-view-options"
import {BookFilters} from "./book-filters"
import {Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils"

export function MobileToolbar({ searchKey }: { searchKey?: string }) {
  return (
    <div className="flex sm:hidden flex-col gap-3 w-full">
      <div className="w-full min-w-0">
        <BookSearch key={searchKey} />
      </div>
      
      {/* 
        Grid setup for mobile toolbar to prevent overflow.
        We give deterministic space to each element so text can truncate gracefully. 
      */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-2 items-center w-full">
        <Sheet>
          <SheetTrigger 
            className={cn(
              buttonVariants({ variant: "outline" }), 
              "shadow-sm w-full min-w-0 bg-background hover:bg-muted/50 border-border transition-colors justify-center"
            )}
          >
            <Filter className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">Filters</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col">
            <div className="p-5 pb-0">
              <SheetTitle className="text-lg font-semibold tracking-tight">Filters</SheetTitle>
              <SheetDescription className="text-sm mt-1">Refine your book search</SheetDescription>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pt-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <BookFilters />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="min-w-0 flex items-center justify-center w-full">
          <BookSort />
        </div>
        
        <div className="shrink-0 flex justify-end">
          <BookViewOptions />
        </div>
      </div>
    </div>
  )
}
