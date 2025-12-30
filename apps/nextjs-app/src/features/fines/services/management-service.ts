import { FineDto, FineSearchRequest } from "../types/management-types";
import { PageResponse } from "@/lib/types";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { ApiError } from "@/lib/api/core/ApiError";

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
    const errorBody = await response.json().catch(() => ({}));
    
    throw new ApiError(
        {
            method: options.method as any || 'GET',
            url: url,
        }, 
        {
            ok: false,
            status: response.status,
            statusText: response.statusText,
            body: errorBody,
            url: url
        }, 
        errorBody.message || `API Error: ${response.status}`
    );
  }

  const json = await response.json();
  return json.data; 
}

export const fineManagementService = {
  getAllFines: async (params: FineSearchRequest): Promise<PageResponse<FineDto>> => {
    const query = new URLSearchParams();

    if (params.userId) query.append("userId", params.userId.toString());
    if (params.userEmail) query.append("userEmail", params.userEmail);
    if (params.loanId) query.append("loanId", params.loanId.toString());
    if (params.bookId) query.append("bookId", params.bookId.toString());
    if (params.status) query.append("status", params.status);
    if (params.minAmount) query.append("minAmount", params.minAmount.toString());
    if (params.maxAmount) query.append("maxAmount", params.maxAmount.toString());
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 20).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    return fetchJson<PageResponse<FineDto>>(`${API_BASE_URL}/api/management/fines?${query.toString()}`);
  },
  
  // Add other methods if needed (create, update, etc.)
};
