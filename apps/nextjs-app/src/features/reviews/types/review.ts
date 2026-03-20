export type Review = {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}

export type ReviewSearchParams = {
  page?: number;
  size?: number;
  bookId?: number;
  userId?: number;
  sort?: string[];
}
