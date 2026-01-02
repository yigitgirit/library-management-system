import { JWTPayload } from "jose"
import { Role } from "@/features/users/types/user"

export type CustomJwtPayload = JWTPayload & {
  sub: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
}
