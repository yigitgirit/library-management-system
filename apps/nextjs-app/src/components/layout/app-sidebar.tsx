"use client"

import * as React from "react"
import {
  Book,
  LayoutDashboard,
  Users,
  Banknote,
  Library,
  LogOut,
  User as UserIcon,
  Home,
  Settings,
  ChevronsUpDown,
  Barcode,
  PenTool,
  Tags,
  MessageSquare
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/features/users/types/user"
import { useAuthStore } from "@/features/auth/store"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { ROLES } from "@/constants"
import { useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  const isAdmin = user?.roles?.includes(ROLES.ADMIN)

  const handleLogout = async () => {
    await logoutAction()
    logout()
    queryClient.removeQueries()
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    {
      title: "Back to Home",
      url: "/",
      icon: Home,
      visible: true,
      isExternal: true,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      title: "Books",
      url: "/dashboard/books",
      icon: Book,
      visible: true,
    },
    {
      title: "Authors",
      url: "/dashboard/authors",
      icon: PenTool,
      visible: isAdmin,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Tags,
      visible: isAdmin,
    },
    {
      title: "Copies",
      url: "/dashboard/copies",
      icon: Barcode,
      visible: true,
    },
    {
      title: "Loans",
      url: "/dashboard/loans",
      icon: Library,
      visible: true,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: MessageSquare,
      visible: isAdmin,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      visible: isAdmin,
    },
    {
      title: "Fines",
      url: "/dashboard/fines",
      icon: Banknote,
      visible: true,
    },
  ]

  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-0"
              asChild
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Library className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Library Admin</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.filter(item => item.visible).map((item) => (
            <React.Fragment key={item.title}>
              {item.title === "Dashboard" && <SidebarSeparator className="my-2" />}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={!item.isExternal && pathname === item.url} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-0"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="avatar.svg" alt={user?.firstName} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="avatar.svg" alt={user?.firstName} />
                      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
