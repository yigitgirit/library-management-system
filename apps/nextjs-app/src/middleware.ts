import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { ROLES } from "@/lib/constants"

// Define protected routes and their required roles
// Order matters: specific routes should come before general routes
const protectedRoutes = [
  {
    path: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER],
  },
  {
    path: "/loans",
    roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER],
  },
]

const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl

  // 1. Handle Auth Routes (Login/Register)
  if (authRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // 2. Handle Protected Routes
  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  )

  if (protectedRoute) {
    // If no token, redirect to login
    if (!accessToken) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Get the secret from environment variables
      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
        console.error("JWT_SECRET is not defined in environment variables")
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Backend uses Base64 decoding for the secret key, so do the same here
      // Convert Base64 string to Uint8Array
      const secret = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0))

      // Verify the token signature
      const { payload } = await jwtVerify(accessToken, secret)
      
      const userRoles = (payload.roles as string[]) || []

      // Check if user has at least one of the required roles
      const hasAccess = protectedRoute.roles.some((role) =>
        userRoles.includes(role)
      )

      if (!hasAccess) {
        // User is authenticated but doesn't have permission
        // If trying to access a specific management page, redirect to dashboard overview
        if (pathname.startsWith("/dashboard/") && pathname !== "/dashboard") {
             return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        // Otherwise redirect to home
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars).*)",
  ],
}
