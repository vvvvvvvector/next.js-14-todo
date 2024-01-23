import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username: string;
    };
  }

  interface User {
    id: number;
    username: string;
  }
}
