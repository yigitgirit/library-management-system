"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Search} from "lucide-react"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
        <div className="relative w-full">
            <Input
                type="search"
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-5 h-12 bg-background/80 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        <Button type="submit" size="lg" className="h-12">
            <Search className="mr-2 h-4 w-4"/>
            Search
        </Button>
    </form>
  )
}
