"use client"

import { UrlSubmitSearch } from "@/components/ui/search"

export function BookSearch() {
  return (
    <UrlSubmitSearch
      placeholder="Search books, authors, ISBN..."
      paramName="search"
      containerClassName="w-full"
      className="w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-emerald-700 dark:focus-visible:border-emerald-500 shadow-sm transition-all rounded-md h-9"
    />
  )
}
