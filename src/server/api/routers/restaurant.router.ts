import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createRestaurantSchema,
  deleteRestaurantSchema,
  getRestaurantSchema,
  updateRestaurantSchema,
} from "../schemas/restaurant.schema";
import {
  createRestaurant,
  deleteRestaurant,
  findAllRestaurants,
  findRestaurant,
  updateRestaurant,
} from "../services/restaurant.service";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: protectedProcedure
    .input(getRestaurantSchema)
    .query(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS

      const result = await findRestaurant(
        { id: input.restaurantId },
        ctx.prisma
      );

      return result;
    }),
  getAllRestaurants: protectedProcedure.query(async ({ ctx }) => {
    return await findAllRestaurants(
      { userId: ctx.session.user.id },
      ctx.prisma
    );
  }),
  createRestaurant: protectedProcedure
    .input(createRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      return await createRestaurant(
        { ...input, userId: ctx.session.user.id },
        ctx.prisma
      );
    }),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      await updateRestaurant(input, { id: input.restaurantId }, ctx.prisma);

      return await findRestaurant({ id: input.restaurantId }, ctx.prisma);
    }),
  deleteRestaurant: protectedProcedure
    .input(deleteRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      await deleteRestaurant({ id: input.restaurantId }, ctx.prisma);

      return await findAllRestaurants(
        { userId: ctx.session.user.id },
        ctx.prisma
      );
    }),
});
