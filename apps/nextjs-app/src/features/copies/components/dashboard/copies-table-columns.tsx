"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Copy } from "@/features/copies/types/copy"
import { StatusBadge } from "@/components/ui/status-badge"
import { CopiesTableActions } from "./copies-table-actions"

export const columns: ColumnDef<Copy>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => <span className="font-mono">{row.original.barcode}</span>,
  },
  {
    accessorKey: "book",
    header: "Book",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-medium line-clamp-1" title={row.original.book.title}>{row.original.book.title}</span>
            <span className="text-xs text-muted-foreground">
                {row.original.book.authors && row.original.book.authors.length > 0 ? row.original.book.authors[0].name : "Unknown"}
            </span>
        </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <CopiesTableActions copy={row.original} />
      </div>
    ),
  },
]
