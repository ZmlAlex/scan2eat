import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
  updateProductsPositionHandler,
} from "~/server/api/product/product.controller";
import {
  createProductSchemaInput,
  deleteProductSchemaInput,
  updateProductSchemaInput,
  updateProductsPositionSchemaInput,
} from "~/server/api/product/product.schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(createProductSchemaInput)
    .mutation(({ ctx, input }) => createProductHandler({ ctx, input })),
  updateProduct: protectedProcedure
    .input(updateProductSchemaInput)
    .mutation(({ ctx, input }) => updateProductHandler({ ctx, input })),
  updateProductsPosition: protectedProcedure
    .input(updateProductsPositionSchemaInput)
    .mutation(({ ctx, input }) =>
      updateProductsPositionHandler({ ctx, input })
    ),
  deleteProduct: protectedProcedure
    .input(deleteProductSchemaInput)
    .mutation(({ ctx, input }) => deleteProductHandler({ ctx, input })),
});
