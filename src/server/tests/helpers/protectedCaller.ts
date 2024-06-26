import type { User } from "@prisma/client";
import { type Session } from "next-auth";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export type TestCaller = ReturnType<typeof appRouter.createCaller>;

export const createProtectedCaller = (user: User) => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: user.id, name: user.name },
  };

  const caller = appRouter.createCaller(
    createInnerTRPCContext({ session: mockSession })
  );

  return caller;
};
