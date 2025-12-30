import { BookControllerService } from "@/lib/api"
import { EditBookForm } from "@/features/books/components/dashboard/edit-book-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card"
import { Button } from "@/features/common/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type EditBookPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
        notFound();
    }

    let bookData;

    try {
        const response = await BookControllerService.getBookById({id: bookId});
        bookData = response.data;
    } catch (error) {
        notFound();
    }

    if (!bookData) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/books">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Book</h2>
                        <p className="text-sm text-muted-foreground">
                            Update book details for &#34;{bookData.title}&#34;.
                        </p>
                    </div>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/books/${bookId}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View in Catalog
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Book Details</CardTitle>
                    <CardDescription>
                        Make changes to the book information here. Click save when you&#39;re done.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditBookForm book={bookData} />
                </CardContent>
            </Card>
        </div>
    )
}
