export enum CopyStatus {
  AVAILABLE = "AVAILABLE",
  LOANED = "LOANED",
  LOST = "LOST",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED"
}

export type BookShortDto = {
  id: number;
  title: string;
  isbn: string;
  authorName: string;
}

export type CopyDto = {
  id: number;
  book: BookShortDto;
  barcode: string;
  status: CopyStatus;
  location: string;
}

export type CopyCreateRequest = {
  bookId: number;
  barcode: string;
  location: string;
}

export type CopyUpdateRequest = {
  barcode: string;
  status: CopyStatus;
  location: string;
}

export type CopySearchRequest = {
  barcode?: string;
  isbn?: string;
  bookId?: number;
  copyStatus?: CopyStatus;
  page?: number;
  size?: number;
  sort?: string;
}
