"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {BookOpen, CreditCard, Info, LayoutDashboard, Menu, Phone, Settings, User} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {cn} from "@/lib/utils"
import {useAuth} from "@/features/auth/hooks/use-auth"
import {ROLES} from "@/constants"
import {Separator} from "@/components/ui/separator"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { user } = useAuth()
  
  const hasDashboardAccess = user?.roles?.some(role => role === ROLES.ADMIN || role === ROLES.LIBRARIAN)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="px-1 text-left">
            <SheetTitle asChild>
                <Link
                href="/"
                className="flex items-center"
                onClick={() => setOpen(false)}
                >
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="font-bold">Library System</span>
                </Link>
            </SheetTitle>
        </SheetHeader>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-1 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            
            <div className="flex flex-col space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground px-2">Menu</h4>
                <MobileLink href="/books" onOpenChange={setOpen} icon={<BookOpen className="mr-2 h-4 w-4" />}>
                    Catalog
                </MobileLink>
                <MobileLink href="/about" onOpenChange={setOpen} icon={<Info className="mr-2 h-4 w-4" />}>
                    About Us
                </MobileLink>
                <MobileLink href="/contact" onOpenChange={setOpen} icon={<Phone className="mr-2 h-4 w-4" />}>
                    Contact
                </MobileLink>
            </div>

            {user && (
                <>
                    <Separator />
                    <div className="flex flex-col space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground px-2">Account</h4>
                        <MobileLink href="/loans" onOpenChange={setOpen} icon={<CreditCard className="mr-2 h-4 w-4" />}>
                            My Loans
                        </MobileLink>
                        <MobileLink href="/profile" onOpenChange={setOpen} icon={<User className="mr-2 h-4 w-4" />}>
                            Profile
                        </MobileLink>
                        <MobileLink href="/settings" onOpenChange={setOpen} icon={<Settings className="mr-2 h-4 w-4" />}>
                            Settings
                        </MobileLink>
                    </div>
                </>
            )}

            {hasDashboardAccess && (
                <>
                    <Separator />
                    <div className="flex flex-col space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground px-2">Admin</h4>
                        <MobileLink href="/dashboard" onOpenChange={setOpen} icon={<LayoutDashboard className="mr-2 h-4 w-4" />}>
                            Dashboard
                        </MobileLink>
                    </div>
                </>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  icon?: React.ReactNode
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  icon,
  ...props
}: MobileLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(
        "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        pathname === href ? "bg-accent text-accent-foreground" : "text-foreground/70",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  )
}
