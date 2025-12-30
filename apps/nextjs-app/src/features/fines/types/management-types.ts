export enum FineStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  WAIVED = "WAIVED"
}

export type FineDto = {
  id: number;
  userId: number;
  userEmail: string;
  loanId: number;
  amount: number;
  reason: string;
  status: FineStatus;
  fineDate: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type FineSearchRequest = {
  userId?: number;
  userEmail?: string;
  loanId?: number;
  bookId?: number;
  status?: FineStatus;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
  sort?: string;
}
