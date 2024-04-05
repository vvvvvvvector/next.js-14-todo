import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';

import { db } from '~/lib/db';

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

        const user = await db.user.findUnique({
          where: {
            username: credentials.username
          }
        });

        if (user) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordValid) {
            return {
              id: user.id,
              username: user.username
            };
          }
        }

        throw new Error('Wrong username or password');
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
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
