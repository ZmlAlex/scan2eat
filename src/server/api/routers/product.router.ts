import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { uploadImage } from "~/server/utils/cloudinary";

import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { createProduct, updateProduct } from "../services/product.service";
import { findRestaurant } from "../services/restaurant.service";

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const uploadedImage = await uploadImage(
        input.imageUrl,
        ctx.session.user.id
      );
      input.imageUrl = uploadedImage.url;

      const createdProduct = await createProduct(input, ctx.prisma);

      return await findRestaurant(
        { menu: { some: { id: createdProduct.menuId } } },
        ctx.prisma
      );
    }),
  updateProduct: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.imageUrl) {
        const uploadedImage = await uploadImage(
          input.imageUrl,
          ctx.session.user.id
        );
        input.imageUrl = uploadedImage.url;
      }
      const updatedProduct = await updateProduct(input, ctx.prisma);

      return await findRestaurant(
        {
          menu: { some: { id: updatedProduct.menuId } },
        },
        ctx.prisma
      );
    }),
  deleteProduct: protectedProcedure
    .input(deleteProductSchema)
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.product.delete({
        where: {
          id: input.productId,
        },
      });
      return await findRestaurant(
        { menu: { some: { id: deletedProduct.menuId } } },
        ctx.prisma
      );
    }),
});
