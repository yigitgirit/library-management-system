import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { ROLES } from "@/constants"

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

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value
  const { pathname } = request.nextUrl

  // 1. Redirect authenticated users away from auth pages (login/register)
  if (authRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // 2. Check if the route is protected
  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  )

  if (protectedRoute) {
    if (!accessToken) {
      if (refreshToken) {
        // Allow request to proceed. The Server Component will try to fetch data, fail with 401,
        // and then trigger the refresh logic we just implemented in server-client.ts.
        return NextResponse.next()
      }

      // If neither token exists, redirect to login
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    try {
      const secretKey = process.env.JWT_SECRET_KEY
      if (!secretKey) {
        console.error("JWT_SECRET_KEY is not defined in environment variables")
        // If configuration is missing, fail safe to login
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Verify the token
      const secret = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0))
      const { payload } = await jwtVerify(accessToken, secret)
      
      const userRoles = (payload.roles as string[]) || []

      // Check role-based access
      const hasAccess = protectedRoute.roles.some((role) =>
        userRoles.includes(role)
      )

      if (!hasAccess) {
        // Redirect to dashboard root if unauthorized for specific sub-route, or home
        if (pathname.startsWith("/dashboard/") && pathname !== "/dashboard") {
             return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // If token verification fails (e.g. expired), but we have a refresh token,
      // we should let it pass so the Server Component can handle the refresh.
      if (refreshToken) {
        return NextResponse.next()
      }

      console.error("Token verification failed:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars).*)",
  ],
}
