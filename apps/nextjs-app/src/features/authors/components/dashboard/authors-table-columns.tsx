"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Author } from "@/features/authors/types/author"
import { AuthorsTableActions } from "./authors-table-actions"

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "biography",
    header: "Biography",
    cell: ({ row }) => <span className="max-w-xs truncate block" title={row.original.biography}>{row.original.biography}</span>,
  },
  {
    accessorKey: "birthDate",
    header: "Birth Date",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <AuthorsTableActions author={row.original} />
      </div>
    ),
  },
]
