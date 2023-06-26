import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  createCategorySchemaInput,
  deleteCategorySchemaInput,
  updateCategorySchemaInput,
} from "../schemas/category.schema";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/category.service";
import { findRestaurant } from "../services/restaurant.service";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchemaInput)
    .mutation(async ({ ctx, input }) => {
      await createCategory(input, ctx.prisma);

      return await findRestaurant(
        { menu: { some: { id: input.menuId } } },
        ctx.prisma
      );
    }),
  updateCategory: protectedProcedure
    .input(updateCategorySchemaInput)
    .mutation(async ({ ctx, input }) => {
      await updateCategory(input, ctx.prisma);

      return await findRestaurant(
        { menu: { some: { category: { some: { id: input.categoryId } } } } },
        ctx.prisma
      );
    }),
  deleteCategory: protectedProcedure
    .input(deleteCategorySchemaInput)
    .mutation(async ({ ctx, input }) => {
      const deletedCategory = await deleteCategory(
        { id: input.categoryId },
        ctx.prisma
      );

      return await findRestaurant(
        { menu: { some: { id: deletedCategory.menuId } } },
        ctx.prisma
      );
    }),
});
