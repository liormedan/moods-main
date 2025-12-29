import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")
  const isPublicPath = request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/api") || request.nextUrl.pathname.startsWith("/_next")

  // If trying to access protected route without token, redirect to login
  if (!token && !isAuthPage && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If already logged in and trying to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Create response
  const response = NextResponse.next()

  // Set headers for Firebase Auth popup compatibility
  // Cross-Origin-Opener-Policy: same-origin-allow-popups allows Firebase Auth popups to work
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
