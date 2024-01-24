import NextAuth from 'next-auth';

declare module 'next-auth' {
  // todo: broaden type, not replace with the new
  interface Session {
    user: {
      id: string;
      username: string;
    };
  }

  interface User {
    id: string;
    username: string;
  }
}
