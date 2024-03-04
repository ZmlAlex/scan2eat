import type { ProductI18N, ProductTranslationField } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_PRODUCTS_PER_CATEGORY } from "~/config/limitations";
import { baseErrorMessage } from "~/helpers/errorMapper";
import * as productRepository from "~/server/api/product/product.repository";
import type {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
  UpdateProductsPositionInput,
} from "~/server/api/product/product.schema";
import * as restaurantRepository from "~/server/api/restaurant/restaurant.repository";
import type { ProtectedContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { uploadImage } from "~/server/libs/cloudinary";

export const createProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateProductInput;
}) => {
  const { price, isEnabled, ...restInput } = input;
  const userId = ctx.session.user.id;
  let uploadedImageUrl;
  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (
    restaurant.product.filter(
      (product) => product.categoryId === input.categoryId
    ).length >= MAX_PRODUCTS_PER_CATEGORY
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: baseErrorMessage.ReachedProductsLimit,
    });
  }

  if (restaurant.restaurantLanguage.length > 1) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<ProductTranslationField>(
        {
          sourceLanguage: input.languageCode,
          fieldsForTranslation: [
            ["name", input.name],
            ["description", input.description],
          ],
          restaurantLanguages: restaurant.restaurantLanguage,
        }
      );
  }
  const mainTranslations =
    formatFieldsToTranslationTable<ProductTranslationField>(
      ["name", "description"],
      restInput
    );
  const translations = [...mainTranslations, ...additionalTranslations];

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  await productRepository.createProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    translations,
    prisma
  );
};

export const updateProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductInput;
}) => {
  const {
    price,
    isImageDeleted,
    autoTranslateEnabled,
    isEnabled,
    ...restInput
  } = input;
  const userId = ctx.session.user.id;
  //if image is deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = isImageDeleted ? "" : undefined;
  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (restaurant.restaurantLanguage.length > 1 && autoTranslateEnabled) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<ProductTranslationField>(
        {
          sourceLanguage: input.languageCode,
          restaurantLanguages: restaurant.restaurantLanguage,
          fieldsForTranslation: [
            ["name", input.name],
            ["description", input.description],
          ],
        }
      );
  }
  const mainTranslations =
    formatFieldsToTranslationTable<ProductTranslationField>(
      ["name", "description"],
      restInput
    );
  const translations = [...mainTranslations, ...additionalTranslations];

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  await productRepository.updateProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    translations,
    prisma
  );
};

export const updateProductsPosition = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductsPositionInput;
}) => {
  const userId = ctx.session.user.id;

  await productRepository.updateManyProductsPositions(input, userId, prisma);
};

export const deleteProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteProductInput;
}) => {
  const userId = ctx.session.user.id;

  await productRepository.deleteProduct(
    {
      id: input.productId,
      userId,
    },
    prisma
  );
};
