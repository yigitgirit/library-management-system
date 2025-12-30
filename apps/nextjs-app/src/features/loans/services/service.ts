import { Loan, LoanSearchParams } from "../types/types";
import { PageResponse } from "@/lib/types";
import { OpenAPI } from "@/lib/api/core/OpenAPI";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = OpenAPI.TOKEN;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data; 
}

export const loanService = {
  getMyLoans: async (params: LoanSearchParams): Promise<PageResponse<Loan>> => {
    const query = new URLSearchParams();

    if (params.bookTitle) query.append("bookTitle", params.bookTitle);
    if (params.isbn) query.append("isbn", params.isbn);
    if (params.status) query.append("status", params.status);
    if (params.overdue) query.append("overdue", "true");
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 10).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    return fetchJson<PageResponse<Loan>>(`${API_BASE_URL}/api/loans/my-loans?${query.toString()}`);
  },
};
