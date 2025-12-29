import { cookies } from "next/headers"
import { decodeJwt } from "jose"
import { UserDto } from "@/lib/api"
import { CustomJwtPayload } from "@/lib/types"

export async function getCurrentUser(): Promise<UserDto | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return null
  }

  try {
    // Decode token to get user info
    // We don't verify signature here for performance, middleware/backend handles security
    const payload: CustomJwtPayload = decodeJwt(accessToken) as CustomJwtPayload
    
    // Map JWT payload to UserDto
    return {
      email: payload.email || payload.sub,
      firstName: payload.firstName || "User",
      lastName: payload.lastName || "",
      roles: (payload.roles as Array<'MEMBER' | 'LIBRARIAN' | 'ADMIN'>) || []
    }
  } catch (e) {
    console.error("Failed to decode token", e)
    return null
  }
}
