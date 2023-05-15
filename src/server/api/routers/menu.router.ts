import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
  getMenu: publicProcedure
    //TODO: update zod schema
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      return "get menu";
    }),
});
