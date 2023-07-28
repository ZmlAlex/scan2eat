import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  createCategoryHandler,
  deleteCategoryHandler,
  updateCategoryHandler,
} from "../controllers/category.controller";
import {
  createCategorySchemaInput,
  deleteCategorySchemaInput,
  updateCategorySchemaInput,
} from "../schemas/category.schema";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchemaInput)
    .mutation(async ({ ctx, input }) => createCategoryHandler({ ctx, input })),
  updateCategory: protectedProcedure
    .input(updateCategorySchemaInput)
    .mutation(async ({ ctx, input }) => updateCategoryHandler({ ctx, input })),
  deleteCategory: protectedProcedure
    .input(deleteCategorySchemaInput)
    .mutation(async ({ ctx, input }) => deleteCategoryHandler({ ctx, input })),
});
