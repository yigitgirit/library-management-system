import { 
  UserNotificationPreferenceDto,
  UpdateNotificationPreferenceRequest
} from "./types";
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

export const notificationService = {
  getNotificationPreferences: async (): Promise<UserNotificationPreferenceDto[]> => {
    return fetchJson<UserNotificationPreferenceDto[]>(`${API_BASE_URL}/api/notification-preferences`);
  },

  updateNotificationPreference: async (data: UpdateNotificationPreferenceRequest): Promise<UserNotificationPreferenceDto> => {
    return fetchJson<UserNotificationPreferenceDto>(`${API_BASE_URL}/api/notification-preferences`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
};
