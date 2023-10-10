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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createInnerTRPCContext({ session: mockSession, log, req: undefined })
  );

  return caller;
};
