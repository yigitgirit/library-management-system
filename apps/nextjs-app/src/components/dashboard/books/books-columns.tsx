"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BookDto } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { BooksTableActions } from "./books-table-actions"

export const columns: ColumnDef<BookDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60, // Fixed width for ID
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 300, // Allocate more space for titles
    cell: ({ row }) => (
        <div className="font-medium line-clamp-1 max-w-[300px]" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
    ),
  },
  {
    accessorKey: "authors",
    header: "Author",
    size: 200,
    cell: ({ row }) => {
      const authors = row.original.authors || []
      const names = authors.map(a => a.name).join(", ")
      return <div className="truncate max-w-[200px]" title={names}>{names}</div>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 120,
    cell: ({ row }) => {
      const category = row.original.category
      return <Badge variant="outline" className="font-normal">{category?.name}</Badge>
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 100,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    },
  },
  {
    accessorKey: "availableCopies",
    header: "Stock",
    size: 80,
    cell: ({ row }) => {
      const stock = row.getValue("availableCopies") as number
      return (
          <Badge variant={stock > 0 ? "secondary" : "destructive"} className="w-12 justify-center">
            {stock}
          </Badge>
      )
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <BooksTableActions book={row.original} />,
  },
]