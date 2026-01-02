import { Book } from "@/features/books/types/book"

export enum CopyStatus {
  AVAILABLE = "AVAILABLE",
  LOANED = "LOANED",
  LOST = "LOST",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED"
}

export type Copy = {
  id: number;
  book: Book;
  barcode: string;
  status: CopyStatus;
  location: string;
}

export type CopySearchParams = {
  barcode?: string;
  isbn?: string;
  bookId?: number;
  copyStatus?: CopyStatus; // Changed from status to copyStatus to match backend
  page?: number;
  size?: number;
  sort?: string[];
}
