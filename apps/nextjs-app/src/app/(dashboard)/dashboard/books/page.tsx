import { BooksContent } from "@/components/dashboard/books/books-content"
import { BooksToolbar } from "@/components/dashboard/books/books-toolbar"
import {BookSearchParams, bookSearchParamsSchema} from "@/lib/validations/book-search"

type BooksManagementPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BooksManagementPage(props: BooksManagementPageProps) {
    const rawParams = await props.searchParams;
    const result = bookSearchParamsSchema.safeParse(rawParams);
    const parsedParams: BookSearchParams = result.success ? result.data : bookSearchParamsSchema.parse({});

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Book Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage library inventory of {parsedParams.search ? "filtered" : "all"} books.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <BooksToolbar initialFilters={parsedParams} />
                <BooksContent params={parsedParams} />
            </div>
        </div>
    )
}
