import { z } from "zod"

export const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roles: z.array(z.enum(['ADMIN', 'LIBRARIAN', 'MEMBER'])).min(1, "At least one role is required"),
})

export const userUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  roles: z.array(z.enum(['ADMIN', 'LIBRARIAN', 'MEMBER'])).optional(),
})

export const userBanSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

export const userEditProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmationPassword: z.string().min(1, "Confirmation password is required"),
}).refine((data) => data.newPassword === data.confirmationPassword, {
  message: "Passwords don't match",
  path: ["confirmationPassword"],
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type UserBanInput = z.infer<typeof userBanSchema>
export type UserEditProfileInput = z.infer<typeof userEditProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
