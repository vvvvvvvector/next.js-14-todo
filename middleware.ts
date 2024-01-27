import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

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
        return Response.redirect(new URL(`/${token.username}`, req.url));
      }

      // if (token.username !== req.nextUrl.pathname.slice(1)) {
      //   return Response.redirect(new URL(`/error`, req.url));
      // }

      return null; // just does nothing -> interrupting middleware further exec. 🤷‍♂️
    }
  },
  {
    callbacks: {
      async authorized() {
        return true; // without it the code above doesn't work
      }
    }
  }
);

// It seems not to be working tbh if I have middleware above like above 🧐
// export const config = {
//   matcher: ['/:username*']
// };
