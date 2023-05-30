import { appRouter } from "~/server/api/root";
import { type Session } from "next-auth";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type { User } from "@prisma/client";

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
