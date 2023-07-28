import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import {
  createProductSchemaInput,
  deleteProductSchemaInput,
  updateProductSchemaInput,
} from "../schemas/product.schema";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(createProductSchemaInput)
    .mutation(({ ctx, input }) => createProductHandler({ ctx, input })),
  updateProduct: protectedProcedure
    .input(updateProductSchemaInput)
    .mutation(({ ctx, input }) => updateProductHandler({ ctx, input })),
  deleteProduct: protectedProcedure
    .input(deleteProductSchemaInput)
    .mutation(({ ctx, input }) => deleteProductHandler({ ctx, input })),
});
