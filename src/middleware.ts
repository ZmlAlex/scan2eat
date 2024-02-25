import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "~/libs/nextIntl/navigation";

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  async (req) => {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.includes("/login");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (!isAuth && !isAuthPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    const response = intlMiddleware(req);
    return response;
  },
  {
    callbacks: {
      // This is a work-around for handling redirect on auth pages.
      // We return true here so that the middleware function above
      // is always called.
      authorized: () => true,
    },
    pages: {
      signIn: "[locale]/login",
    },
  }
);

const protectedPages = ["/dashboard", "/login"];

export default function middleware(req: NextRequest) {
  const protectedPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${protectedPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isProtectedPage = protectedPathnameRegex.test(req.nextUrl.pathname);

  if (isProtectedPage) {
    // temp solution from https://next-intl-docs.vercel.app/docs/routing/middleware#example-auth-js
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
