export enum LoanStatus {
  ACTIVE = "ACTIVE",
  OVERDUE = "OVERDUE",
  RETURNED = "RETURNED",
  RETURNED_OVERDUE = "RETURNED_OVERDUE",
  RETURNED_DAMAGED = "RETURNED_DAMAGED",
  LOST = "LOST"
}

export enum FineStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  WAIVED = "WAIVED",
  CANCELLED = "CANCELLED"
}

export type Fine = {
    id: number;
    amount: number;
    status: FineStatus;
    reason?: string;
    fineDate: string;
    paymentDate?: string;
}

export type Loan = {
  id: number;
  userId: number;
  userEmail: string;
  copyId: number;
  bookTitle: string;
  bookIsbn: string;
  bookCoverUrl?: string;
  status: LoanStatus;
  loanDate: string; // ISO Date
  dueDate: string; // ISO Date
  returnDate?: string; // ISO Date
  isOverdue: boolean;
  fines?: Fine[];
}

export type LoanUserSummaryDto = {
  id: number;
  bookTitle: string;
  bookCoverUrl?: string;
  status: LoanStatus;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  isOverdue: boolean;
  fines?: Fine[];
}

export type LoanSearchParams = {
  userId?: number;
  userEmail?: string;
  copyId?: number;
  barcode?: string;
  bookId?: number;
  isbn?: string;
  bookTitle?: string;
  status?: LoanStatus;
  overdue?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
}
