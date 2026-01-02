import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center p-4">
        <div className="rounded-full bg-muted p-4">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground max-w-[500px]">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t exist.
        </p>
        <div className="flex gap-2 mt-4">
            <Button asChild>
            <Link href="/">
                Go back home
            </Link>
            </Button>
            <Button variant="outline" asChild>
            <Link href="/books">
                Browse Catalog
            </Link>
            </Button>
        </div>
    </div>
  )
}
