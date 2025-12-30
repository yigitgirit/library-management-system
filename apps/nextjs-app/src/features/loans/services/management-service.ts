import { LoanDto, LoanCreateRequest, LoanSearchRequest, LoanReportDamagedRequest } from "../types/management-types";
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

export const loanManagementService = {
  getAllLoans: async (params: LoanSearchRequest): Promise<PageResponse<LoanDto>> => {
    const query = new URLSearchParams();

    if (params.userId) query.append("userId", params.userId.toString());
    if (params.userEmail) query.append("userEmail", params.userEmail);
    if (params.copyId) query.append("copyId", params.copyId.toString());
    if (params.barcode) query.append("barcode", params.barcode);
    if (params.bookId) query.append("bookId", params.bookId.toString());
    if (params.isbn) query.append("isbn", params.isbn);
    if (params.bookTitle) query.append("bookTitle", params.bookTitle);
    if (params.status) query.append("status", params.status);
    if (params.overdue !== undefined) query.append("overdue", params.overdue.toString());
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 20).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    return fetchJson<PageResponse<LoanDto>>(`${API_BASE_URL}/api/management/loans?${query.toString()}`);
  },

  createLoan: async (data: LoanCreateRequest): Promise<LoanDto> => {
    return fetchJson<LoanDto>(`${API_BASE_URL}/api/management/loans`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  returnLoan: async (id: number): Promise<LoanDto> => {
    return fetchJson<LoanDto>(`${API_BASE_URL}/api/management/loans/${id}/return`, {
      method: "POST",
    });
  },

  reportLost: async (id: number): Promise<LoanDto> => {
    return fetchJson<LoanDto>(`${API_BASE_URL}/api/management/loans/${id}/report-lost`, {
      method: "POST",
    });
  },

  reportDamaged: async (id: number, data: LoanReportDamagedRequest): Promise<LoanDto> => {
    return fetchJson<LoanDto>(`${API_BASE_URL}/api/management/loans/${id}/report-damaged`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  deleteLoan: async (id: number): Promise<void> => {
      return fetchJson<void>(`${API_BASE_URL}/api/management/loans/${id}`, {
          method: "DELETE",
      });
  }
};
