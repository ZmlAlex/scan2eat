import type { CategoryTranslationFields, PrismaPromise } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          menuId: input.menuId,
          categoryI18N: {
            create: {
              fieldName: "name",
              translation: input.name,
              languageCode: input.languageCode,
            },
          },
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(updateCategorySchema)
    .mutation(({ ctx, input }) => {
      const translationFields: CategoryTranslationFields[] = ["name"];

      const transactions: PrismaPromise<unknown>[] = translationFields
        .map((field) => ({
          fieldName: field,
          translation: input[field] || "",
          languageCode: input.languageCode,
        }))
        .filter(({ translation }) => translation)
        .map((record) =>
          ctx.prisma.categoryI18N.updateMany({
            data: {
              translation: record.translation,
            },
            where: {
              languageCode: { equals: record.languageCode },
              fieldName: record.fieldName,
              categoryId: input.categoryId,
            },
          })
        );

      return ctx.prisma.$transaction(transactions);
    }),
  deleteCategory: protectedProcedure
    .input(deleteCategorySchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.delete({
        where: {
          id: input.categoryId,
        },
      });
    }),
});
