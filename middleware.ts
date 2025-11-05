import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest){
  if (req.nextUrl.pathname.startsWith('/admin')){
    const sid = req.cookies.get('sid')?.value
    if (!sid) return NextResponse.redirect(new URL('/', req.url))
    try{ jwt.verify(sid, process.env.APP_SECRET!) } catch{ return NextResponse.redirect(new URL('/', req.url)) }
  }
  return NextResponse.next()
}
export const config = { matcher: ['/admin/:path*'] }
