import { Badge } from "@/components/ui/badge"
import { LoanStatus } from "@/features/loans/types/loan"
import { FineStatus } from "@/features/fines/types/fine"
import { CopyStatus } from "@/features/copies/types/copy"

type StatusType = LoanStatus | FineStatus | CopyStatus | boolean | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let label = String(status);

  // Loan Status Logic
  if (Object.values(LoanStatus).includes(status as LoanStatus)) {
    switch (status) {
      case LoanStatus.ACTIVE:
        variant = "default"; // or a specific 'success' variant if available
        break;
      case LoanStatus.OVERDUE:
      case LoanStatus.LOST:
      case LoanStatus.RETURNED_DAMAGED:
      case LoanStatus.RETURNED_OVERDUE:
        variant = "destructive";
        break;
      case LoanStatus.RETURNED:
        variant = "secondary";
        break;
    }
  }
  // Fine Status Logic
  else if (Object.values(FineStatus).includes(status as FineStatus)) {
    switch (status) {
      case FineStatus.UNPAID:
        variant = "destructive";
        break;
      case FineStatus.PAID:
        variant = "secondary"; // or success
        break;
      case FineStatus.WAIVED:
        variant = "outline";
        break;
    }
  }
  // Copy Status Logic
  else if (Object.values(CopyStatus).includes(status as CopyStatus)) {
    switch (status) {
      case CopyStatus.AVAILABLE:
        variant = "default"; // success
        break;
      case CopyStatus.LOANED:
        variant = "secondary";
        break;
      case CopyStatus.LOST:
      case CopyStatus.RETIRED:
      case CopyStatus.MAINTENANCE:
        variant = "destructive"; // or warning for maintenance
        break;
    }
  }
  // Boolean Logic (e.g. User Active/Banned)
  else if (typeof status === 'boolean') {
      // This is tricky because 'true' could mean 'Active' (good) or 'Locked' (bad) depending on context.
      // It's better to pass the specific string or handle booleans in the parent if context is needed.
      // For generic boolean:
      variant = status ? "default" : "secondary";
  }
  // String Fallback
  else {
      if (status === 'Active') variant = "default";
      if (status === 'Inactive') variant = "secondary";
      if (status === 'Banned') variant = "destructive";
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
