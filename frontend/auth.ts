import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          if (!user) return null;
          
          // In real app use bcrypt.compare. For migration from Django pbkdf2 might be tricky.
          // For new users created via seed, we will use bcrypt.
          // If the password starts with pbkdf2, we can't verify it easily with bcryptjs.
          // So for this migration, we assume we reset passwords or implement a custom verifier.
          // For now, assuming bcrypt hash.
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.role = (user as any).role;
            token.id = (user as any).id;
        }
        return token;
    },
    async session({ session, token }) {
        if (token && session.user) {
            (session.user as any).role = token.role;
            (session.user as any).id = token.id;
        }
        return session;
    }
  }
});
