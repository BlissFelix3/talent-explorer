import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow public routes
  const publicPaths = ["/login", "/signup", "/"]
  const { pathname } = request.nextUrl

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, let the client-side auth guard handle redirection
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
