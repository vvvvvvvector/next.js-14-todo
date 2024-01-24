import NextAuth from 'next-auth';

declare module 'next-auth' {
  // todo: broaden type, not replace with the new
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
