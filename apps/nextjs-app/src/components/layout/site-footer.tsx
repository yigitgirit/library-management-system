import Link from "next/link"
import { BookOpen } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="py-12 md:px-8 border-t bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Library System</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering communities with seamless access to knowledge. Discover, borrow, and grow with our modern library management solution.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Library System. All rights reserved.</p>
          <Link href="https://github.com/yigitgirit/library-management-system">
            <p>Built by yigit</p>
          </Link>
        </div>
      </div>
    </footer>
  )
}
