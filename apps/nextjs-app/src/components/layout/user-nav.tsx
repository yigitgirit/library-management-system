"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/common/components/ui/avatar"
import { Button } from "@/features/common/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu"
import { useAuthStore } from "@/features/auth/store"
import { logoutAction } from "@/app/actions/auth"
import { User, CreditCard, Settings, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { ROLES } from "@/lib/constants"
import { UserDto } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface UserNavProps {
  user?: UserDto | null
}

export function UserNav({ user: propUser }: UserNavProps) {
  const { user: storeUser, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  
  // Prefer propUser (from server) over storeUser (from client state)
  // This prevents layout shift during hydration
  const user = propUser || storeUser

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    // 1. Call server action to clear cookies
    await logoutAction()
    
    // 2. Clear client-side store
    logout()
    
    // 3. Clear React Query cache to prevent stale data
    queryClient.removeQueries()
    
    // 4. Refresh/Redirect
    router.push('/login')
    router.refresh()
  }

  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
  const hasDashboardAccess = user.roles?.some(role => role === ROLES.ADMIN || role === ROLES.LIBRARIAN)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={user.firstName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {hasDashboardAccess && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/loans">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Loans</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
