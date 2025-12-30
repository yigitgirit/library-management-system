export enum LoanStatus {
  ACTIVE = "ACTIVE",
  OVERDUE = "OVERDUE",
  RETURNED = "RETURNED",
  RETURNED_OVERDUE = "RETURNED_OVERDUE",
  RETURNED_DAMAGED = "RETURNED_DAMAGED",
  LOST = "LOST"
}

export type FineDto = {
    id: number;
    amount: number;
    status: string;
}

export type Loan = {
  id: number;
  bookTitle: string;
  bookCoverUrl?: string;
  status: LoanStatus;
  loanDate: string; // ISO Date (Instant)
  dueDate: string; // ISO Date (Instant)
  returnDate?: string; // ISO Date (Instant)
  isOverdue: boolean;
  fines?: FineDto[];
}

export type LoanSearchParams = {
  bookTitle?: string;
  isbn?: string;
  status?: LoanStatus; // Backend might support multiple statuses if changed to List<LoanStatus> or we call multiple times
  overdue?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
