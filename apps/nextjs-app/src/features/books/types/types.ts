export type Author = {
  id: number;
  name: string;
}

export type Category = {
  id: number;
  name: string;
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
  category: Category;
}

export type BookSearchParams = {
  search?: string;
  categoryIds?: number[];
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string; // e.g. "title,asc"
}

export type ShowcaseBook = {
  id: number
  title: string
  author: string
  coverUrl: string
  rating?: number
}
