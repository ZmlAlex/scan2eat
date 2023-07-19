import type {
  CategoryTranslationField,
  ProductTranslationField,
  RestaurantTranslationField,
} from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForNewLanguage } from "~/server/helpers/createFieldTranslationsForNewLanguage";
import { uploadImage } from "~/server/utils/cloudinary";

import {
  createRestaurantLanguageSchemaInput,
  createRestaurantSchemaInput,
  deleteRestaurantSchemaInput,
  getRestaurantSchemaInput,
  setEnabledRestaurantLanguagesSchemaInput,
  setPublishedRestaurantSchemaInput,
  updateRestaurantSchemaInput,
} from "../schemas/restaurant.schema";
import { updateManyCategoryTranslations } from "../services/category.service";
import { updateManyProductTranslations } from "../services/product.service";
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
  getAllRestaurants: protectedProcedure.query(async ({ ctx }) => {
    return await findAllRestaurants(
      { userId: ctx.session.user.id },
      ctx.prisma
    );
  }),
  createRestaurant: protectedProcedure
    .input(createRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) => {
      let uploadedImageUrl;
      const userId = ctx.session.user.id;

      if (input.logoImageBase64) {
        const uploadedImage = await uploadImage(input.logoImageBase64, userId);
        uploadedImageUrl = uploadedImage.url;
      }

      //TODO: MOVE IT TO CONTROLERS
      return await createRestaurant(
        { ...input, userId, logoUrl: uploadedImageUrl },
        ctx.prisma
      );
    }),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS
      const userId = ctx.session.user.id;
      //if image deleted we want to remove it from db, if not keep - original in db
      let uploadedImageUrl = input.isImageDeleted ? "" : undefined;

      if (input.logoImageBase64) {
        const uploadedImage = await uploadImage(input.logoImageBase64, userId);
        uploadedImageUrl = uploadedImage.url;
      }

      await updateRestaurant(
        { ...input, logoUrl: uploadedImageUrl },
        { id: input.restaurantId },
        ctx.prisma
      );

      return await findRestaurant(
        {
          id: input.restaurantId,
        },
        ctx.prisma
      );
    }),
  createRestaurantLanguage: protectedProcedure
    .input(createRestaurantLanguageSchemaInput)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO CONTROLERS

      const restaurant = await findRestaurant(
        {
          id: input.restaurantId,
        },
        ctx.prisma
      );

      //TODO: CHANGE WITH DEFAULT LANGUAGE
      const defaultRestaurantLanguage =
        restaurant.restaurantLanguage[0]?.languageCode ?? "english";

      const categoriesTextForTranslationPromises =
        createFieldTranslationsForNewLanguage<CategoryTranslationField>({
          defaultLanguage: defaultRestaurantLanguage,
          items: restaurant.menu.category ?? [],
          itemKey: "categoryI18N",
          itemIdIdentificator: "categoryId",
          targetLanguage: input.languageCode,
        });

      const productsTextForTranslationPromises =
        createFieldTranslationsForNewLanguage<ProductTranslationField>({
          defaultLanguage: defaultRestaurantLanguage,
          items: restaurant.menu.product ?? [],
          itemKey: "productI18N",
          itemIdIdentificator: "productId",
          targetLanguage: input.languageCode,
        });

      const restaurantTextForTranslationPromises =
        createFieldTranslationsForNewLanguage<RestaurantTranslationField>({
          defaultLanguage: defaultRestaurantLanguage,
          items: [restaurant],
          itemKey: "restaurantI18N",
          targetLanguage: input.languageCode,
        });

      const restaurantResult = await Promise.all(
        restaurantTextForTranslationPromises
      );
      const categoriesResult = await Promise.all(
        categoriesTextForTranslationPromises
      );
      const productsResult = await Promise.all(
        productsTextForTranslationPromises
      );

      await prisma.$transaction(async (tx) => {
        //TODO: MOVE IT TO THE SERVICE
        await tx.restaurant.update({
          where: {
            id: input.restaurantId,
          },
          data: {
            restaurantI18N: { createMany: { data: restaurantResult } },
            restaurantLanguage: {
              create: { languageCode: input.languageCode },
            },
          },
        });

        await updateManyCategoryTranslations(categoriesResult, tx);
        await updateManyProductTranslations(productsResult, tx);
      });

      return await findRestaurant({ id: input.restaurantId }, ctx.prisma);
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
  setEnabledRestaurantLanguages: protectedProcedure
    .input(setEnabledRestaurantLanguagesSchemaInput)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO THE SERVICE?
      const restaurantLanguageTransactions = input.languageCodes.map(
        (language) =>
          ctx.prisma.restaurantLanguage.updateMany({
            where: {
              restaurantId: input.restaurantId,
              languageCode: language.languageCode,
            },
            data: {
              isEnabled: language.isEnabled,
            },
          })
      );

      await prisma.$transaction(restaurantLanguageTransactions);

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
