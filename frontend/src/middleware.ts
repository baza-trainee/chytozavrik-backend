export { default } from 'next-auth/middleware';

export const config = { matcher: ['/parents/:path*', '/wigwam/:path*', '/admin/:path*'] };
