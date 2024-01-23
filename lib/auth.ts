import { type NextAuthOptions } from 'next-auth';

import Credentials from 'next-auth/providers/credentials';

import { PAGES } from '~/lib/constants';

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: +process.env.NEXTAUTH_SECRET_EXPIRES_IN!
  },
  pages: {
    signIn: PAGES.SIGN_IN
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials provider',
      credentials: {
        username: { label: 'username', type: 'text', required: true },
        password: { label: 'password', type: 'password', required: true }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        if (
          credentials.username === 'admin' &&
          credentials.password === 'admin'
        ) {
          // this will be passed to the jwt callback
          return {
            id: 1,
            username: 'vvvvvectoer'
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.username = token.username as string;
      }

      return session; // so user will be able to retrieve id and username from session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }

      return token; // this will be passed to the session callback
    }
  }
} satisfies NextAuthOptions;
