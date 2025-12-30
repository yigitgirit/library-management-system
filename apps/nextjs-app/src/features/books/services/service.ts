import { Book, BookSearchParams, Category } from "../types/types";
import { PageResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchJson<T>(url: string): Promise<T> {
  // console.log("Fetching:", url); // Debug log
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  // Backend wraps response in { success: true, data: ... }
  return json.data; 
}

export const bookService = {
  getBooks: async (params: BookSearchParams): Promise<PageResponse<Book>> => {
    const query = new URLSearchParams();

    if (params.search) query.append("search", params.search);
    
    if (params.categoryIds && params.categoryIds.length > 0) {
      // Append each category ID separately: categoryIds=1&categoryIds=2
      params.categoryIds.forEach(id => query.append("categoryIds", id.toString()));
    }

    if (params.available) query.append("available", "true");
    if (params.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 12).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    const url = `${API_BASE_URL}/api/books?${query.toString()}`;
    console.log("BookService: Fetching books with URL:", url); // Debug log
    return fetchJson<PageResponse<Book>>(url);
  },

  getCategories: async (): Promise<PageResponse<Category>> => {
    // Fetch all categories (large size)
    return fetchJson<PageResponse<Category>>(`${API_BASE_URL}/api/categories?page=0&size=100`);
  }
};
