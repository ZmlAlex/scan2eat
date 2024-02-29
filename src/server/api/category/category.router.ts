import {
  createCategoryHandler,
  deleteCategoryHandler,
  updateCategoriesPositionHandler,
  updateCategoryHandler,
} from "~/server/api/category/category.controller";
import {
  createCategorySchemaInput,
  deleteCategorySchemaInput,
  updateCategoriesPositionSchemaInput,
  updateCategorySchemaInput,
} from "~/server/api/category/category.schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchemaInput)
    .mutation(async ({ ctx, input }) => createCategoryHandler({ ctx, input })),
  updateCategory: protectedProcedure
    .input(updateCategorySchemaInput)
    .mutation(async ({ ctx, input }) => updateCategoryHandler({ ctx, input })),
  updateCategoriesPosition: protectedProcedure
    .input(updateCategoriesPositionSchemaInput)
    .mutation(({ ctx, input }) =>
      updateCategoriesPositionHandler({ ctx, input })
    ),
  deleteCategory: protectedProcedure
    .input(deleteCategorySchemaInput)
    .mutation(async ({ ctx, input }) => deleteCategoryHandler({ ctx, input })),
});
