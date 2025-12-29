"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean   // True only when there is NO data (Initial Load)
    isFetching?: boolean  // True whenever a request is in flight (Filter/Page Change)
    pageSize?: number
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             isLoading,
                                             isFetching,
                                             pageSize = 10,
                                         }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const headers = table.getFlatHeaders()

    return (
        <div className="relative rounded-md border bg-card overflow-hidden">
            {/* 1. Background Fetching Progress Bar */}
            {!isLoading && isFetching && (
                <div className="absolute inset-x-0 top-0 z-50 h-[2px] bg-primary/20">
                    <div className="h-full bg-primary animate-progress-loading w-1/3" />
                </div>
            )}

            <Table className={cn(
                "transition-opacity duration-300",
                !isLoading && isFetching && "opacity-50 pointer-events-none"
            )}>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} style={{ width: header.column.getSize() }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {/* 2. Skeletons: Only shown if we have ZERO data to show */}
                    {isLoading ? (
                        Array.from({ length: pageSize }).map((_, i) => (
                            <TableRow key={i} className="hover:bg-transparent">
                                {headers.map((header) => (
                                    <TableCell key={header.id}>
                                        <Skeleton
                                            className={cn(
                                                "h-5 w-full",
                                                (header.column.columnDef.meta as any)?.skeletonClassName
                                            )}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                No books found in the collection.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}