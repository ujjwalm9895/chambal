import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/cms/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnCMS = nextUrl.pathname.startsWith('/cms');
      const isLoginPage = nextUrl.pathname === '/cms/login';

      if (isOnCMS) {
        if (isLoginPage) {
            if (isLoggedIn) return Response.redirect(new URL('/cms', nextUrl));
            return true;
        }
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
