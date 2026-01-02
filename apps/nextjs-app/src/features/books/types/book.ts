export type Author = {
  id?: number;
  name?: string;
  bookCount?: number;
}

export type Category = {
  id?: number;
  name?: string;
}

export type Book = {
  id: number;
  isbn: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  price: number;
  publisher?: string;
  publishedDate?: string; // ISO Date string (YYYY-MM-DD)
  pageCount?: number;
  language?: string;
  format?: string;
  availableCopies?: number;
  availableLocation?: string;
  authors: Author[];
  category?: Category;
}

// Extended type for UI presentation
export type BookDetail = Book & {
  publicationYear: string;
  isAvailable: boolean;
  statusDetail: string;
  locationDisplay: string;
  rating?: number;      // Mock/Future field
  reviewCount?: number; // Mock/Future field
}

export type BookSearchParams = {
  search?: string;
  isbn?: string;
  title?: string;
  authorName?: string;
  categoryIds?: number[];
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string[]; // Example: ["title,asc"]
}

export type ShowcaseBook = {
  id: number
  title: string
  author: string
  coverUrl: string
  rating?: number
}
