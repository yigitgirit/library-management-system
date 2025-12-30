import { LoanStatus } from "./types";

export type LoanDto = {
  id: number;
  userId: number;
  userEmail: string;
  copyId: number;
  bookTitle: string;
  bookIsbn: string;
  bookCoverUrl?: string;
  status: LoanStatus;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  isOverdue: boolean;
}

export type LoanCreateRequest = {
  userId: number;
  copyId: number;
  dueDate?: string; // Optional, backend might set default
}

export type LoanReportDamagedRequest = {
  damageAmount: number;
  damageDescription: string;
}

export type LoanSearchRequest = {
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
  sort?: string;
}
