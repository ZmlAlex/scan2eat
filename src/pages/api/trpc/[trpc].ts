import { createNextApiHandler } from "@trpc/server/adapters/next";
import { withAxiom } from "next-axiom";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default withAxiom(
  createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ path, error, ctx }) => {
      ctx?.log.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
      );
    },
  })
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5MB",
    },
  },
};
