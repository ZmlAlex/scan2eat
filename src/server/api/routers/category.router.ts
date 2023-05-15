import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    //TODO: update zod schema
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "create restaurant";
    }),
  updateCategory: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "update category";
    }),
  deleteCategory: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "delete category";
    }),
});
