import type { ProductI18N, ProductTranslationField } from "@prisma/client";

import type { Context } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { uploadImage } from "~/server/utils/cloudinary";

import type {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { createProduct, updateProduct } from "../services/product.service";
import { findRestaurantById } from "../services/restaurant.service";

export const createProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateProductInput;
}) => {
  let uploadedImageUrl;

  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

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

  if (input.imageBase64 && ctx.session?.user.id) {
    const uploadedImage = await uploadImage(
      input.imageBase64,
      ctx.session.user.id
    );
    uploadedImageUrl = uploadedImage.url;
  }

  const createdProduct = await createProduct(
    { ...input, imageUrl: uploadedImageUrl },
    additionalTranslations,
    ctx.prisma
  );

  return await findRestaurantById(createdProduct.restaurantId, ctx.prisma);
};

export const updateProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateProductInput;
}) => {
  //if image deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = input.isImageDeleted ? "" : undefined;

  if (input.imageBase64 && ctx.session?.user.id) {
    const uploadedImage = await uploadImage(
      input.imageBase64,
      ctx.session.user.id
    );
    uploadedImageUrl = uploadedImage.url;
  }

  const updatedProduct = await updateProduct(
    { ...input, imageUrl: uploadedImageUrl },
    ctx.prisma
  );

  return await findRestaurantById(updatedProduct.restaurantId, ctx.prisma);
};

export const deleteProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: DeleteProductInput;
}) => {
  const deletedProduct = await ctx.prisma.product.delete({
    where: {
      id: input.productId,
    },
  });
  return await findRestaurantById(deletedProduct.restaurantId, ctx.prisma);
};
