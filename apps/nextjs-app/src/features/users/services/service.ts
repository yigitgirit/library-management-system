import { 
  User, 
  UserCreateRequest, 
  UserUpdateRequest, 
  UserBanRequest, 
  UserSearchParams,
  UserPublicProfile, 
  UserPrivateProfile, 
  UserEditProfileRequest, 
  UserEditProfileResponse, 
  ChangePasswordRequest
} from "./types";
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

export const userService = {
  // Management Endpoints
  getAllUsers: async (params: UserSearchParams): Promise<PageResponse<User>> => {
    const query = new URLSearchParams();
    
    // Pagination
    query.append("page", (params.page || 0).toString());
    query.append("size", (params.size || 20).toString());
    
    // Sorting
    if (params.sort) {
      query.append("sort", params.sort);
    }

    return fetchJson<PageResponse<User>>(`${API_BASE_URL}/api/management/users?${query.toString()}`);
  },

  getUserById: async (id: number): Promise<User> => {
    return fetchJson<User>(`${API_BASE_URL}/api/management/users/${id}`);
  },

  createUser: async (data: UserCreateRequest): Promise<User> => {
    return fetchJson<User>(`${API_BASE_URL}/api/management/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateUser: async (id: number, data: UserUpdateRequest): Promise<User> => {
    return fetchJson<User>(`${API_BASE_URL}/api/management/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: number): Promise<void> => {
    return fetchJson<void>(`${API_BASE_URL}/api/management/users/${id}`, {
      method: "DELETE",
    });
  },

  banUser: async (id: number, reason: string): Promise<void> => {
    return fetchJson<void>(`${API_BASE_URL}/api/management/users/${id}/ban`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  unbanUser: async (id: number): Promise<void> => {
    return fetchJson<void>(`${API_BASE_URL}/api/management/users/${id}/unban`, {
      method: "POST",
    });
  },

  // Profile Endpoints
  getMyProfile: async (): Promise<UserPrivateProfile> => {
    return fetchJson<UserPrivateProfile>(`${API_BASE_URL}/api/users/me`);
  },

  getUserPublicProfile: async (id: number): Promise<UserPublicProfile> => {
    return fetchJson<UserPublicProfile>(`${API_BASE_URL}/api/users/${id}`);
  },

  editMyProfile: async (data: UserEditProfileRequest): Promise<UserEditProfileResponse> => {
    return fetchJson<UserEditProfileResponse>(`${API_BASE_URL}/api/users/me`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
      // Endpoint not yet implemented in backend
      console.warn("Change password endpoint not implemented yet.");
      return fetchJson<void>(`${API_BASE_URL}/api/users/me/password`, {
          method: "POST",
          body: JSON.stringify(data)
      });
  }
};
