"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Loan } from "@/features/loans/types/loan"
import { StatusBadge } from "@/components/ui/status-badge"
import { LoansTableActions } from "./loans-table-actions"
import { format, parseISO } from "date-fns"

export const columns: ColumnDef<Loan>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "userEmail",
    header: "User",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-medium">{row.original.userEmail}</span>
            <span className="text-xs text-muted-foreground">ID: {row.original.userId}</span>
        </div>
    ),
  },
  {
    accessorKey: "bookTitle",
    header: "Book",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-medium line-clamp-1" title={row.original.bookTitle}>{row.original.bookTitle}</span>
            <span className="text-xs text-muted-foreground">Copy ID: {row.original.copyId}</span>
        </div>
    ),
  },
  {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: ({ row }) => format(parseISO(row.original.loanDate), "MMM d, yyyy"),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
        <span className={row.original.isOverdue ? "text-destructive font-medium" : ""}>
            {format(parseISO(row.original.dueDate), "MMM d, yyyy")}
        </span>
    ),
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
        <LoansTableActions loan={row.original} />
      </div>
    ),
  },
]
