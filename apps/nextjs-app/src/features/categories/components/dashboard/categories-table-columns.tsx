"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category } from "@/features/categories/types/category"
import { CategoriesTableActions } from "./categories-table-actions"

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="max-w-xs truncate block" title={row.original.description}>{row.original.description}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <CategoriesTableActions category={row.original} />
      </div>
    ),
  },
]
