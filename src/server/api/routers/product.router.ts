import type {
  Product,
  ProductTranslationFields,
  PrismaPromise,
} from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(createProductSchema)
    .mutation(({ ctx, input }) => {
      const translationFields: ProductTranslationFields[] = [
        "name",
        "description",
      ];

      // TODO: move it to helpers
      const translations = translationFields.map((field) => ({
        fieldName: field,
        translation: input[field],
        languageCode: input.languageCode,
      }));

      return ctx.prisma.product.create({
        data: {
          imageUrl: input.imageUrl,
          isEnabled: input.isEnabled,
          price: input.price,
          menuId: input.menuId,
          categoryId: input.categoryId,
          measurementUnit: input.measurmentUnit,
          measurementValue: input.measurmentValue,
          productI18N: {
            createMany: { data: translations },
          },
        },
      });
    }),
  updateProduct: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedData: Partial<Product> = {
        price: input.price,
        isEnabled: input.isEnabled,
        measurementUnit: input.measurmentUnit,
        measurementValue: input.measurmentValue,
        imageUrl: input.imageUrl,
      };

      const translationFields: ProductTranslationFields[] = [
        "name",
        "description",
      ];

      const transactions: PrismaPromise<unknown>[] = translationFields
        .map((field) => ({
          fieldName: field,
          translation: input[field] || "",
          languageCode: input.languageCode,
        }))
        .filter(({ translation }) => translation)
        .map((record) =>
          ctx.prisma.productI18N.updateMany({
            data: {
              translation: record.translation,
            },
            where: {
              languageCode: { equals: record.languageCode },
              fieldName: record.fieldName,
              productId: input.productId,
            },
          })
        );

      return ctx.prisma.$transaction([
        ...transactions,
        ctx.prisma.restaurant.update({
          where: { id: input.productId },
          data: updatedData,
        }),
      ]);
    }),
  deleteProduct: protectedProcedure
    .input(deleteProductSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.delete({
        where: {
          id: input.productId,
        },
      });
    }),
});
