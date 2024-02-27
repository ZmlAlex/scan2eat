import type { ProductI18N, ProductTranslationField } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_PRODUCTS_PER_CATEGORY } from "~/config/limitations";
import { baseErrorMessage } from "~/helpers/errorMapper";
import type {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
  UpdateProductsPositionInput,
} from "~/server/api/product/product.schema";
import {
  createProduct,
  updateManyProductsPositions,
  updateProduct,
} from "~/server/api/product/product.service";
import { findRestaurantByIdAndUserId } from "~/server/api/restaurant/restaurant.service";
import type { ProtectedContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { uploadImage } from "~/server/libs/cloudinary";

export const createProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateProductInput;
}) => {
  const userId = ctx.session.user.id;
  let uploadedImageUrl;

  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantByIdAndUserId(
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

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  const createdProduct = await createProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    additionalTranslations,
    prisma
  );

  return findRestaurantByIdAndUserId(
    { restaurantId: createdProduct.restaurantId, userId },
    prisma
  );
};

export const updateProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductInput;
}) => {
  const userId = ctx.session.user.id;
  //if image deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = input.isImageDeleted ? "" : undefined;
  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (restaurant.restaurantLanguage.length > 1 && input.autoTranslateEnabled) {
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

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  const updatedProduct = await updateProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    additionalTranslations,
    prisma
  );

  return findRestaurantByIdAndUserId(
    { restaurantId: updatedProduct.restaurantId, userId },
    prisma
  );
};

export const updateProductsPositionHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductsPositionInput;
}) => {
  const userId = ctx.session.user.id;

  const [updatedProduct] = await updateManyProductsPositions(
    input,
    userId,
    prisma
  );
  return findRestaurantByIdAndUserId(
    { restaurantId: updatedProduct?.restaurantId ?? "", userId },
    prisma
  );
};

export const deleteProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteProductInput;
}) => {
  const userId = ctx.session.user.id;

  const deletedProduct = await prisma.product.delete({
    where: {
      id: input.productId,
      userId,
    },
  });

  return findRestaurantByIdAndUserId(
    { restaurantId: deletedProduct.restaurantId, userId },
    prisma
  );
};