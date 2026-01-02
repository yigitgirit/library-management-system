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

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl

  if (authRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  )

  if (protectedRoute) {
    if (!accessToken) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    try {
      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
        console.error("JWT_SECRET is not defined in environment variables")
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const secret = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0))

      const { payload } = await jwtVerify(accessToken, secret)
      
      const userRoles = (payload.roles as string[]) || []

      const hasAccess = protectedRoute.roles.some((role) =>
        userRoles.includes(role)
      )

      if (!hasAccess) {
        if (pathname.startsWith("/dashboard/") && pathname !== "/dashboard") {
             return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
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
