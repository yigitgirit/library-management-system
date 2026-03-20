"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Review } from "@/features/reviews/types/review"
import { Badge } from "@/components/ui/badge"
import { ReviewsTableActions } from "./reviews-table-actions"
import { format } from "date-fns"
import { StarRating } from "../star-rating"

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "bookId",
    header: "Book ID",
    size: 80,
  },
  {
    accessorKey: "userName",
    header: "User",
    size: 150,
    cell: ({ row }) => {
      const userName = row.getValue("userName") as string
      return <span className="truncate">{userName}</span>
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    size: 120,
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number
      return <StarRating value={rating} onChangeAction={() => {}} readonly size="sm" />
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    size: 300,
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string | undefined
      return (
        <div className="truncate max-w-[300px]" title={comment}>
          {comment || "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return format(new Date(date), "MMM d, yyyy")
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => (
      <div className="text-right">
        <ReviewsTableActions review={row.original} />
      </div>
    ),
  },
]

