import { cookies } from "next/headers"
import { decodeJwt } from "jose"
import { User } from "@/features/users/types/user"
import { CustomJwtPayload } from "@/lib/types"

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return null
  }

  try {
    // Decode token to get user info
    // We don't verify signature here for performance, middleware/backend handles security
    const payload = decodeJwt(accessToken) as unknown as CustomJwtPayload
    
    // Map JWT payload to User
    return {
      id: Number(payload.sub), // 'sub' claim contains the User ID
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.roles,
      status: 'ACTIVE', // Default assumption for logged in user, token implies active session
      createdAt: undefined,
      updatedAt: undefined
    }
  } catch (e) {
    console.error("Failed to decode token", e)
    return null
  }
}
