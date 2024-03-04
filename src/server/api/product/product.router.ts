import * as productController from "~/server/api/product/product.controller";
import * as productSchema from "~/server/api/product/product.schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(productSchema.createProductInput)
    .mutation(productController.createProduct),
  updateProduct: protectedProcedure
    .input(productSchema.updateProductInput)
    .mutation(productController.updateProduct),
  updateProductsPosition: protectedProcedure
    .input(productSchema.updateProductsPositionInput)
    .mutation(productController.updateProductsPosition),
  deleteProduct: protectedProcedure
    .input(productSchema.deleteProductInput)
    .mutation(productController.deleteProduct),
});
