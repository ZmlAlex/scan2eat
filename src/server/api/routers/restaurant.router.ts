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
import { translate } from "~/server/utils/awsSdk";
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
  createRestaurantLanguage: protectedProcedure
    .input(createRestaurantLanguageSchemaInput)
    .mutation(async ({ ctx, input }) => {
      //TODO: MOVE IT TO HELPERS
      // const toTextTranslationPromises =
      //   (fieldIdName?: "productId" | "categoryId") =>
      //   async (item: { id: string; field: [string, string] }) => {
      //     const [fieldName, fieldValue] = item.field;

      //     const { TranslatedText: translatedText } = await translate({
      //       Text: fieldValue,
      //       TargetLanguageCode: input.languageCode,
      //       SourceLanguageCode:
      //         //TODO: USE DEFAULT LANGUAGE CODE
      //         restaurant.restaurantLanguage[0]?.languageCode ?? "english",
      //     });

      //     return {
      //       ...(fieldIdName && { [fieldIdName]: item.id }),
      //       fieldName: fieldName,
      //       translation: translatedText,
      //       //TODO: CHANGE LANGUAGE
      //       languageCode: input.languageCode,
      //     };
      //   };
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

      //categories
      const categoriesTextForTranslation = restaurant.menu.category?.reduce(
        (acc, cur) => {
          const fields = Object.entries(
            cur.categoryI18N[defaultRestaurantLanguage]
          );

          const textForTranslation = fields.map((field) => ({
            id: cur.id,
            field,
          }));

          return [...acc, ...textForTranslation];
        },
        [] as { id: string; field: [string, string] }[]
      );

      const categoriesTextForTranslationPromises =
        categoriesTextForTranslation?.map(async (category) => {
          const [fieldName, fieldValue] = category.field;

          const { TranslatedText: translatedText } = await translate({
            Text: fieldValue,
            TargetLanguageCode: input.languageCode,
            SourceLanguageCode: defaultRestaurantLanguage,
          });

          return {
            categoryId: category.id,
            fieldName: fieldName as CategoryTranslationField,
            translation: translatedText,
            languageCode: input.languageCode,
          };
        }) || [];

      // const categoriesTextForTranslationPromises =
      //   categoriesTextForTranslation?.map(
      //     toTextTranslationPromises("categoryId")
      //   ) || [];

      //products
      const productsTextForTranslation = restaurant.menu.product?.reduce(
        (acc, cur) => {
          // TODO: CHANGE IT!
          const fields = Object.entries(
            cur.productI18N[defaultRestaurantLanguage]
          );

          const textForTranslation = fields.map((field) => ({
            id: cur.id,
            field,
          }));

          return [...acc, ...textForTranslation];
        },
        [] as { id: string; field: [string, string] }[]
      );

      //TODO: MOVE INTO ONE FUNCTION
      const productsTextForTranslationPromises =
        productsTextForTranslation?.map(async (product) => {
          const [fieldName, fieldValue] = product.field;

          const { TranslatedText: translatedText } = await translate({
            Text: fieldValue,
            TargetLanguageCode: input.languageCode,
            SourceLanguageCode: defaultRestaurantLanguage,
          });

          return {
            productId: product.id,
            fieldName: fieldName as ProductTranslationField,
            translation: translatedText,
            languageCode: input.languageCode,
          };
        }) || [];

      // const productsTextForTranslationPromises =
      //   productsTextForTranslation?.map(
      //     toTextTranslationPromises("productId")
      //   ) || [];

      const restaurantTextForTranslation = Object.entries(
        restaurant.restaurantI18N[defaultRestaurantLanguage]
      )
        .map((field) => ({
          id: restaurant.id,
          field,
        }))
        .filter(({ field }) => field[1]);

      const restaurantTextForTranslationPromises =
        restaurantTextForTranslation?.map(async (product) => {
          const [fieldName, fieldValue] = product.field;

          const { TranslatedText: translatedText } = await translate({
            Text: fieldValue,
            TargetLanguageCode: input.languageCode,
            SourceLanguageCode: defaultRestaurantLanguage,
          });

          return {
            fieldName: fieldName as RestaurantTranslationField,
            translation: translatedText,
            languageCode: input.languageCode,
          };
        }) || [];

      const restaurantResult = await Promise.all(
        restaurantTextForTranslationPromises
      );

      const categoriesResult = await Promise.all(
        categoriesTextForTranslationPromises
      );

      const productsResult = await Promise.all(
        productsTextForTranslationPromises
      );

      // get all categories
      // get all products
      // promise all with translator
      //TODO: MOVE IT TO THE SERVICE
      await ctx.prisma.restaurant.update({
        where: {
          id: input.restaurantId,
        },
        data: {
          restaurantI18N: { createMany: { data: restaurantResult } },
          restaurantLanguage: { create: { languageCode: input.languageCode } },
        },
      });

      await updateManyCategoryTranslations(categoriesResult, ctx.prisma);
      await updateManyProductTranslations(productsResult, ctx.prisma);

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
  //TODO: COVER BY TESTS
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
