import type { ProductI18N, ProductTranslationField } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { uploadImage } from "~/server/utils/cloudinary";

import {
  createProductSchemaInput,
  deleteProductSchemaInput,
  updateProductSchemaInput,
} from "../schemas/product.schema";
import { createProduct, updateProduct } from "../services/product.service";
import { findRestaurant } from "../services/restaurant.service";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(createProductSchemaInput)
    .mutation(async ({ ctx, input }) => {
      let additionalTranslations: Pick<
        ProductI18N,
        "fieldName" | "languageCode" | "translation"
      >[] = [];

      const restaurant = await findRestaurant(
        { menu: { some: { id: input.menuId } } },
        ctx.prisma
      );

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

      const uploadedImage = await uploadImage(
        input.imageUrl,
        ctx.session.user.id
      );
      input.imageUrl = uploadedImage.url;

      const createdProduct = await createProduct(
        input,
        additionalTranslations,
        ctx.prisma
      );

      return await findRestaurant(
        { menu: { some: { id: createdProduct.menuId } } },
        ctx.prisma
      );
    }),
  updateProduct: protectedProcedure
    .input(updateProductSchemaInput)
    .mutation(async ({ ctx, input }) => {
      if (input.imageUrl) {
        const uploadedImage = await uploadImage(
          input.imageUrl,
          ctx.session.user.id
        );
        input.imageUrl = uploadedImage.url;
      }
      const updatedProduct = await updateProduct(input, ctx.prisma);

      return await findRestaurant(
        {
          menu: { some: { id: updatedProduct.menuId } },
        },
        ctx.prisma
      );
    }),
  deleteProduct: protectedProcedure
    .input(deleteProductSchemaInput)
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.product.delete({
        where: {
          id: input.productId,
        },
      });
      return await findRestaurant(
        { menu: { some: { id: deletedProduct.menuId } } },
        ctx.prisma
      );
    }),
});
