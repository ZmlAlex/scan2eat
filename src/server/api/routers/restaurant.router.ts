import type {
  Restaurant,
  RestaurantTranslationFields,
  PrismaPromise,
} from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createRestaurantSchema,
  deleteRestaurantSchema,
  getRestaurantSchema,
  updateRestaurantSchema,
} from "../schemas/restaurant.schema";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: protectedProcedure
    .input(getRestaurantSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.restaurant.findFirstOrThrow({
        where: {
          id: input.restaurantId,
        },
        include: {
          restaurantI18N: true,
          currency: true,

          menu: {
            include: {
              category: {
                include: { categoryI18N: true },
              },
              product: {
                include: {
                  productI18N: true,
                },
              },
            },
          },
        },
      });
    }),
  getAllRestaurants: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  createRestaurant: protectedProcedure
    .input(createRestaurantSchema)
    //TODO: MOVE IT TO THE SERVICES
    .mutation(({ ctx, input }) => {
      const translationFields: RestaurantTranslationFields[] = [
        "name",
        "description",
        "address",
      ];

      // TODO: move it to helpers
      const translations = translationFields.map((field) => ({
        fieldName: field,
        translation: input[field] || "",
        languageCode: input.languageCode,
      }));

      return ctx.prisma.restaurant.create({
        data: {
          userId: ctx.session.user.id,
          workingHours: input.workingHours,
          logoUrl: input.logoUrl,
          currencyCode: input.currencyCode,

          menu: {
            create: {},
          },
          restaurantI18N: {
            createMany: {
              data: translations,
            },
          },
        },
      });
    }),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedData: Partial<Restaurant> = {
        logoUrl: input.logoUrl,
        workingHours: input.workingHours,
        currencyCode: input.currencyCode,
      };

      const translationFields: RestaurantTranslationFields[] = [
        "name",
        "description",
        "address",
      ];

      // TODO: move it to helpers
      const transactions: PrismaPromise<unknown>[] = translationFields
        .map((field) => ({
          fieldName: field,
          translation: input[field] || "",
          languageCode: input.languageCode,
        }))
        .filter(({ translation }) => translation)
        .map((record) =>
          ctx.prisma.restaurantI18N.updateMany({
            data: {
              translation: record.translation,
            },
            where: {
              languageCode: { equals: record.languageCode },
              fieldName: record.fieldName,
              restaurantId: input.restaurantId,
            },
          })
        );

      return ctx.prisma.$transaction([
        ...transactions,
        ctx.prisma.restaurant.update({
          where: { id: input.restaurantId },
          data: updatedData,
        }),
      ]);
    }),
  deleteRestaurant: protectedProcedure
    .input(deleteRestaurantSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.restaurant.delete({
        where: {
          id: input.restaurantId,
        },
      });
    }),
});
