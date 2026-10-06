import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale } from '@/lib/i18n'

export function proxy(request: NextRequest) {
  const routeLocale = request.nextUrl.pathname.split('/')[1]
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set('x-site-locale', locale)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
}
