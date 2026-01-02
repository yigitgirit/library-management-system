"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/features/users/types/user"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { UsersTableActions } from "./users-table-actions"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.firstName} {row.original.lastName}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
            {row.original.roles.map(role => (
                <Badge key={role} variant="outline" className="text-xs">
                    {role}
                </Badge>
            ))}
        </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const user = row.original;
        // Map UserStatus to StatusBadge props
        switch (user.status) {
            case 'ACTIVE': return <StatusBadge status="Active" />;
            case 'INACTIVE': return <StatusBadge status="Inactive" />;
            case 'BANNED': return <StatusBadge status="Banned" />;
            case 'DELETED': return <StatusBadge status="Deleted" />;
            default: return <StatusBadge status="Inactive" />;
        }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <UsersTableActions user={row.original} />
      </div>
    ),
  },
]
