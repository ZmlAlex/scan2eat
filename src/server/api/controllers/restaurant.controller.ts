import type {
  CategoryTranslationField,
  ProductTranslationField,
  RestaurantTranslationField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_RESTAURANTS_PER_ACCOUNT } from "~/config/limitations";
import { prisma } from "~/server/db";
import { createFieldTranslationsForNewLanguage } from "~/server/helpers/createFieldTranslationsForNewLanguage";
import { uploadImage } from "~/server/libs/cloudinary";
import { baseErrorMessage } from "~/utils/errorMapper";

import type {
  CreateRestaurantInput,
  CreateRestaurantLanguageInput,
  DeleteRestaurantInput,
  GetRestaurantInput,
  SetEnabledRestaurantLanguagesInput,
  SetPublishedRestaurantInput,
  UpdateRestaurantInput,
} from "../schemas/restaurant.schema";
import { updateManyCategoryTranslations } from "../services/category.service";
import { updateManyProductTranslations } from "../services/product.service";
import {
  createRestaurant,
  deleteRestaurant,
  findAllRestaurants,
  findRestaurantById,
  updateRestaurant,
} from "../services/restaurant.service";
import type { Context, ProtectedContext } from "../trpc";

export const getRestaurantHandler = ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetRestaurantInput;
}) => {
  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const getAllRestaurantsHandler = ({
  ctx,
}: {
  ctx: ProtectedContext;
}) => {
  return findAllRestaurants({ userId: ctx.session.user.id }, ctx.prisma);
};

export const createRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantInput;
}) => {
  const { prisma } = ctx;
  const userId = ctx.session.user.id;
  let uploadedImageUrl;

  const allRestaurants = await findAllRestaurants({ userId }, prisma);

  if (allRestaurants.length >= MAX_RESTAURANTS_PER_ACCOUNT) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: baseErrorMessage.ReachedRestaurantsLimit,
    });
  }

  if (input.logoImageBase64) {
    const uploadedImage = await uploadImage(input.logoImageBase64, userId, log);
    uploadedImageUrl = uploadedImage.url;
  }

  return createRestaurant(
    { ...input, userId, logoUrl: uploadedImageUrl },
    prisma
  );
};

export const updateRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateRestaurantInput;
}) => {
  const { prisma } = ctx;
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
    prisma
  );

  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const setPublishedRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetPublishedRestaurantInput;
}) => {
  await ctx.prisma.restaurant.update({
    where: { id: input.restaurantId },
    data: { isPublished: input.isPublished },
  });

  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const deleteRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteRestaurantInput;
}) => {
  await deleteRestaurant({ id: input.restaurantId }, ctx.prisma);

  return findAllRestaurants({ userId: ctx.session?.user.id }, ctx.prisma);
};

// Restaurant Language handlers

export const createRestaurantLanguageHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantLanguageInput;
}) => {
  const { prisma } = ctx;

  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

  //TODO: CHANGE WITH DEFAULT LANGUAGE
  const defaultRestaurantLanguage =
    restaurant.restaurantLanguage[0]?.languageCode ?? "english";

  const categoriesTextForTranslationPromises =
    createFieldTranslationsForNewLanguage<CategoryTranslationField>({
      defaultLanguage: defaultRestaurantLanguage,
      items: restaurant.category ?? [],
      itemKey: "categoryI18N",
      itemIdIdentificator: "categoryId",
      targetLanguage: input.languageCode,
    });

  const productsTextForTranslationPromises =
    createFieldTranslationsForNewLanguage<ProductTranslationField>({
      defaultLanguage: defaultRestaurantLanguage,
      items: restaurant.product ?? [],
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

  const productsResult = await Promise.all(productsTextForTranslationPromises);

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

  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const setEnabledRestaurantLanguagesHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetEnabledRestaurantLanguagesInput;
}) => {
  const restaurantLanguageTransactions = input.languageCodes.map((language) =>
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

  return findRestaurantById(input.restaurantId, ctx.prisma);
};
