import type {
  CreateCategoryInput,
  DeleteCategorytInput,
  UpdateCategoriesPositionInput,
  UpdateCategoryInput,
} from "~/server/api/category/category.schema";
import * as categoryService from "~/server/api/category/category.service";
import * as restaurantService from "~/server/api/restaurant/restaurant.service";
import type { ProtectedContext } from "~/server/api/trpc";

export const createCategory = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateCategoryInput;
}) => {
  await categoryService.createCategory({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const updateCategory = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoryInput;
}) => {
  await categoryService.updateCategory({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const updateCategoriesPosition = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoriesPositionInput;
}) => {
  const restaurantId = input[0]?.restaurantId ?? "";

  await categoryService.updateCategoriesPosition({
    ctx,
    input,
  });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input: {
      restaurantId,
    },
  });
  return restaurant;
};

export const deleteCategory = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteCategorytInput;
}) => {
  await categoryService.deleteCategory({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};
