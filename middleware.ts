import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

import { PAGES } from '~/lib/constants';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });

    const isAuth = !!token;

    const isAuthPage =
      req.nextUrl.pathname === PAGES.ROOT ||
      req.nextUrl.pathname === PAGES.SIGN_IN ||
      req.nextUrl.pathname === PAGES.SIGN_UP;

    if (isAuth) {
      if (isAuthPage) {
        return NextResponse.redirect(new URL(`/${token.username}`, req.url));
      }

      // if (token.username !== req.nextUrl.pathname.slice(1)) {
      //   return NextResponse.redirect(new URL(`/error`, req.url));
      // }

      return null; // '/', '/sign-in', '/sign-up' pages are allowed for visiting
    }

    if (!isAuthPage) {
      return NextResponse.redirect(new URL(`${PAGES.SIGN_IN}`, req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true; // is always called, without it above code doesn't work
      }
    }
  }
);

// export const config = {
//   matcher: ['/apple']
// };
