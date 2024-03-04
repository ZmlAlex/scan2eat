import * as categoryController from "~/server/api/category/category.controller";
import * as categorySchema from "~/server/api/category/category.schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(categorySchema.createCategoryInput)
    .mutation(categoryController.createCategory),
  updateCategory: protectedProcedure
    .input(categorySchema.updateCategoryInput)
    .mutation(categoryController.updateCategory),
  updateCategoriesPosition: protectedProcedure
    .input(categorySchema.updateCategoriesPositionInput)
    .mutation(categoryController.updateCategoriesPosition),
  deleteCategory: protectedProcedure
    .input(categorySchema.deleteCategoryInput)
    .mutation(categoryController.deleteCategory),
});
