import { CopyDto, CopyCreateRequest, CopyUpdateRequest, CopySearchRequest } from "../types/management-types";
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

export const copyManagementService = {
  getAllCopies: async (params: CopySearchRequest): Promise<PageResponse<CopyDto>> => {
    const query = new URLSearchParams();

    if (params.barcode) query.append("barcode", params.barcode);
    if (params.isbn) query.append("isbn", params.isbn);
    if (params.bookId) query.append("bookId", params.bookId.toString());
    if (params.copyStatus) query.append("copyStatus", params.copyStatus);
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 20).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    return fetchJson<PageResponse<CopyDto>>(`${API_BASE_URL}/api/copies?${query.toString()}`);
  },

  createCopy: async (data: CopyCreateRequest): Promise<CopyDto> => {
    return fetchJson<CopyDto>(`${API_BASE_URL}/api/management/copies`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCopy: async (id: number, data: CopyUpdateRequest): Promise<CopyDto> => {
    return fetchJson<CopyDto>(`${API_BASE_URL}/api/management/copies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  retireCopy: async (id: number): Promise<void> => {
    return fetchJson<void>(`${API_BASE_URL}/api/management/copies/${id}/retire`, {
      method: "POST",
    });
  }
};
