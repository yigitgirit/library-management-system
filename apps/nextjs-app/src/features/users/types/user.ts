import { 
  UserCreateInput, 
  UserUpdateInput, 
  UserBanInput, 
  UserEditProfileInput, 
  ChangePasswordInput 
} from "../schemas/user";

export type Role = 'ADMIN' | 'LIBRARIAN' | 'MEMBER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Re-export Zod types as Request types for consistency
export type UserCreateRequest = UserCreateInput;
export type UserUpdateRequest = UserUpdateInput;
export type UserBanRequest = UserBanInput;
export type UserEditProfileRequest = UserEditProfileInput;
export type ChangePasswordRequest = ChangePasswordInput;

export type UserPublicProfile = {
  firstName: string;
  lastName: string;
}

export type UserPrivateProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt?: string;
}

export type UserEditProfileResponse = {
  firstName: string;
  lastName: string;
}

export type UserSearchParams = {
  page?: number;
  size?: number;
  sort?: string[];
  search?: string; // Generic search
}
