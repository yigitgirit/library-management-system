export enum FineStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  WAIVED = "WAIVED"
}

export type Fine = {
  id: number;
  userId: number;
  userEmail: string;
  loanId: number;
  amount: number;
  reason: string;
  status: FineStatus;
  fineDate: string; // ISO Date
  paymentDate?: string; // ISO Date
  createdAt: string;
  updatedAt: string;
}

export type FineSearchParams = {
  userId?: number;
  userEmail?: string;
  loanId?: number;
  bookId?: number;
  status?: FineStatus;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
  sort?: string[];
}
