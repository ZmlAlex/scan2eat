import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: protectedProcedure
    //TODO: update zod schema
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      return "get restaurant";
    }),
  getAllRestaurants: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      return "get all restaurants";
    }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
  createRestaurant: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "create restaurant";
    }),
  updateRestaurant: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "update restaurant";
    }),
  deleteRestaurant: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return "delete restaurant";
    }),
});
