import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { uploadImage } from "~/server/utils/cloudinary";

import {
  createRestaurantSchemaInput,
  deleteRestaurantSchemaInput,
  // getAllRestaurantsSchemaInput,
  getRestaurantSchemaInput,
  setPublishedRestaurantSchemaInput,
  updateRestaurantSchemaInput,
} from "../schemas/restaurant.schema";
import {
  createRestaurant,
  deleteRestaurant,
  findAllRestaurants,
  findRestaurant,
  updateRestaurant,
} from "../services/restaurant.service";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: publicProcedure
    .input(getRestaurantSchemaInput)
    .query(async ({ ctx, input }) => {
      // TODO: MOVE IT TO CONTROLERS
      return await findRestaurant({ id: input.restaurantId }, ctx.prisma);
    }),
  getAllRestaurants: protectedProcedure
    // .input(getAllRestaurantsSchemaInput)
    .query(async ({ ctx }) => {
      return await findAllRestaurants(
        { userId: ctx.session.user.id },
        ctx.prisma
      );
    }),
  createRestaurant: protectedProcedure
    .input(createRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const uploadedImage = await uploadImage(input.logoUrl, userId);
      input.logoUrl = uploadedImage.url;
      //TODO: MOVE IT TO CONTROLERS
      return await createRestaurant({ ...input, userId }, ctx.prisma);
    }),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchemaInput)
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
    .input(setPublishedRestaurantSchemaInput)
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
    .input(deleteRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      await deleteRestaurant({ id: input.restaurantId }, ctx.prisma);

      return await findAllRestaurants(
        { userId: ctx.session.user.id },
        ctx.prisma
      );
    }),
});
