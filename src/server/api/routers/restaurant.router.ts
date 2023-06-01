import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { uploadImage } from "~/server/utils/cloudinary";

import {
  createRestaurantSchema,
  deleteRestaurantSchema,
  getRestaurantSchema,
  setPublishedRestaurantSchema,
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
      const userId = ctx.session.user.id;
      const uploadedImage = await uploadImage(input.logoUrl, userId);
      input.logoUrl = uploadedImage.url;
      //TODO: MOVE IT TO CONTROLERS
      return await createRestaurant({ ...input, userId }, ctx.prisma);
    }),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      const userId = ctx.session.user.id;

      if (input.logoUrl) {
        const uploadedImage = await uploadImage(input.logoUrl, userId);
        input.logoUrl = uploadedImage.url;
      }

      await updateRestaurant(input, { id: input.restaurantId }, ctx.prisma);
      return await findRestaurant(
        {
          id: input.restaurantId,
        },
        ctx.prisma
      );
    }),
  setPublishedRestaurant: protectedProcedure
    .input(setPublishedRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.restaurant.update({
        where: { id: input.restaurantId },
        data: { isPublished: input.isPublished },
      });

      return await findRestaurant(
        {
          id: input.restaurantId,
        },
        ctx.prisma
      );
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
