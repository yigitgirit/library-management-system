import Link from "next/link"
import {Button} from "@/components/ui/button"
import {BookX, ArrowLeft} from "lucide-react"

export default function BookNotFound() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container mx-auto max-w-7xl py-8 px-4 md:px-8 lg:py-12">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        asChild
                        className="pl-0 hover:bg-transparent hover:text-primary -ml-2"
                    >
                        <Link
                            href="/books"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4"/>
                            Back to Catalog
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="rounded-full bg-muted p-6 mb-6">
                        <BookX className="h-16 w-16 text-muted-foreground"/>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Book Not Found
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-md mb-8">
                        The book you&#39;re looking for doesn&#39;t exist or has been removed from our catalog.
                    </p>

                    <div className="flex gap-4">
                        <Button asChild>
                            <Link href="/books">
                                Browse Catalog
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
