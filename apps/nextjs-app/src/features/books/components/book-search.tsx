"use client"

import {UrlSubmitSearch} from "@/components/ui/search";

export function BookSearch() {
  return (
    <UrlSubmitSearch
      placeholder="Search books by title, author, ISBN..."
      paramName="search"
      className="w-full sm:max-w-sm"
    />
  )
}
