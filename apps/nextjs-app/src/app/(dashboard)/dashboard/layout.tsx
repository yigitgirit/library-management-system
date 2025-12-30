"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/features/common/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Separator } from "@/features/common/components/ui/separator"
import { ROLES } from "@/lib/constants"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { BookOpen } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/features/common/components/ui/breadcrumb"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      const hasAccess = user?.roles?.some(role => 
        role === ROLES.ADMIN || role === ROLES.LIBRARIAN
      )

      if (!hasAccess) {
        router.push("/") 
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <BookOpen className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Library System</h2>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.roles?.some(role => role === ROLES.ADMIN || role === ROLES.LIBRARIAN)) {
    return null
  }

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path)
    
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      const isLast = index === paths.length - 1
      const title = path.charAt(0).toUpperCase() + path.slice(1)

      return (
        <React.Fragment key={path}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      )
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {generateBreadcrumbs()}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto min-h-0">
          <div className="mx-auto max-w-7xl p-10">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
