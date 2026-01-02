"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Fine } from "@/features/fines/types/fine"
import { StatusBadge } from "@/components/ui/status-badge"
import { format, parseISO } from "date-fns"

export const columns: ColumnDef<Fine>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
        <span className="font-medium text-destructive">
            ${row.original.amount.toFixed(2)}
        </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "fineDate",
    header: "Date",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span>{format(parseISO(row.original.fineDate), "MMM d, yyyy")}</span>
            {row.original.paymentDate && (
                <span className="text-xs text-muted-foreground">Paid: {format(parseISO(row.original.paymentDate), "MMM d")}</span>
            )}
        </div>
    ),
  },
]
