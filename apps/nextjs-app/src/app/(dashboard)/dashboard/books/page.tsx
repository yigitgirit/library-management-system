import { BooksManagementView } from "@/features/books/components/dashboard/books-management-view"
import { bookSearchParamsSchema } from "@/features/books/schemas/book-search"
import { NextPageSearchParams } from "@/features/common/types/search-params"
import { DashboardPageHeader } from "@/features/common/components/ui/dashboard-page-header"
import { parseSearchParams } from "@/lib/search-params-utils"

type BooksManagementPageProps = {
    searchParams: Promise<NextPageSearchParams>
}

export default async function BooksManagementPage(props: BooksManagementPageProps) {
    const parsedParams = await parseSearchParams(props.searchParams, bookSearchParamsSchema);

    return (
        <div className="flex flex-col gap-8">
            <DashboardPageHeader 
                heading="Book Management" 
                text={`Manage library inventory of ${parsedParams.search ? "filtered" : "all"} books.`}
            />

            <BooksManagementView initialFilters={parsedParams} />
        </div>
    )
}
