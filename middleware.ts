// import NextAuth from 'next-auth';

// import { authConfig } from '@/app/(auth)/auth.config';

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
// };

import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
