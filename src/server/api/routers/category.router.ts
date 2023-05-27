import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { findRestaurant } from "../services/restaurant.service";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/category.service";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await createCategory(input, ctx.prisma);

      return await findRestaurant(
        { menu: { some: { id: input.menuId } } },
        ctx.prisma
      );
    }),
  updateCategory: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await updateCategory(input, ctx.prisma);

      return await findRestaurant(
        { menu: { some: { category: { some: { id: input.categoryId } } } } },
        ctx.prisma
      );
    }),
  deleteCategory: protectedProcedure
    .input(deleteCategorySchema)
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
