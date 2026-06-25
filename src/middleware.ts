import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get auth token from cookies
  const authToken = request.cookies.get('sb-access-token')?.value

  // Check protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If already logged in and accessing login page, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
