import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
});

export const config = {
  matcher: [
    '/profile/:path*',
    '/places/new/:path*',
    '/places/:path*/edit',
    '/communities/new/:path*',
    '/communities/:path*/edit',
    '/news/new/:path*',
    '/news/:path*/edit',
  ],
}; 