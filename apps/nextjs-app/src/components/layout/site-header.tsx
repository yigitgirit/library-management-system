"use client"

import Link from "next/link"
import { Button } from "@/features/common/components/ui/button"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { BookOpen } from "lucide-react"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Skeleton } from "@/features/common/components/ui/skeleton"

export function SiteHeader() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-8 max-w-7xl relative">
        {/* Mobile Menu Trigger */}
        <MobileNav />

        {/* Left: Logo */}
        <div className="flex items-center mr-4 md:mr-8">
          <Link className="flex items-center space-x-2 group" href="/">
            <BookOpen className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
              Library System
            </span>
          </Link>
        </div>

        {/* Center: Navigation (Desktop) - Absolutely positioned to stay centered regardless of side content widths */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <MainNav />
        </div>

        {/* Right: Auth & Theme */}
        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          {isLoading ? (
            <div className="flex items-center gap-2">
               <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
