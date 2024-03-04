import type {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
  UpdateProductsPositionInput,
} from "~/server/api/product/product.schema";
import * as productService from "~/server/api/product/product.service";
import * as restaurantService from "~/server/api/restaurant/restaurant.service";
import type { ProtectedContext } from "~/server/api/trpc";

export const createProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateProductInput;
}) => {
  await productService.createProduct({ input, ctx });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const updateProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductInput;
}) => {
  await productService.updateProduct({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const updateProductsPosition = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductsPositionInput;
}) => {
  const restaurantId = input[0]?.restaurantId ?? "";

  await productService.updateProductsPosition({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input: { restaurantId },
  });
  return restaurant;
};

export const deleteProduct = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteProductInput;
}) => {
  await productService.deleteProduct({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};
