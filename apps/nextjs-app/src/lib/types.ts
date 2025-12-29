import { JWTPayload } from "jose"

export type CustomJwtPayload = JWTPayload & {
  email?: string
  firstName?: string
  lastName?: string
  roles?: string[]
}

export type PageResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}