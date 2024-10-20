import { NextResponse } from 'next/server';

import {  verifyToken } from './app/lib/utills';

export  function middleware(req) {
  const token = req.cookies.get('token');
  const protectedPaths = ['/', '/viewreport'];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
         verifyToken(token.value); // Ensure the correct secret is used
        // console.log(token)
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/viewreport'],
};
