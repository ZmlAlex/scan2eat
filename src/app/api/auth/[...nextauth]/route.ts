import NextAuth from "next-auth/next";

import { authOptions } from "~/server/libs/auth";

const handler = NextAuth(authOptions) as never;

export { handler as GET, handler as POST };
