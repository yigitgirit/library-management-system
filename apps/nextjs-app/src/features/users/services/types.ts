export type Role = 'ADMIN' | 'LIBRARIAN' | 'MEMBER';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
  locked: boolean;
}

export type UserCreateRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  phoneNumber?: string;
  address?: string;
}

export type UserUpdateRequest = {
  firstName?: string;
  lastName?: string;
  roles?: Role[];
  phoneNumber?: string;
  address?: string;
}

export type UserBanRequest = {
  reason: string;
}

export type UserSearchParams = {
  page?: number;
  size?: number;
  sort?: string;
}

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
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
}

export type UserEditProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export type UserEditProfileResponse = {
  firstName: string;
  lastName: string;
}

export type ChangePasswordRequest = {
  currentPassword?: string;
  newPassword?: string;
  confirmationPassword?: string;
}
