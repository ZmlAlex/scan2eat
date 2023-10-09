import type { User } from "@prisma/client";
import { type Session } from "next-auth";
import { log } from "next-axiom";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export const createProtectedCaller = (user: User) => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: user.id, name: user.name },
  };

  const caller = appRouter.createCaller(
    createInnerTRPCContext({ session: mockSession, log })
  );

  return caller;
};
