import type {
  CreateRestaurantInput,
  CreateRestaurantLanguageInput,
  DeleteRestaurantInput,
  GetRestaurantInput,
  SetEnabledRestaurantLanguagesInput,
  SetPublishedRestaurantInput,
  UpdateRestaurantInput,
} from "~/server/api/restaurant/restaurant.schema";
import * as restaurantService from "~/server/api/restaurant/restaurant.service";
import type { Context, ProtectedContext } from "~/server/api/trpc";

export const getRestaurant = async ({
  input,
}: {
  ctx: Context;
  input: GetRestaurantInput;
}) => {
  const restaurant = await restaurantService.getRestaurant({ input });
  return restaurant;
};

export const getRestaurantWithUserCheck = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: GetRestaurantInput;
}) => {
  const userRestaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return userRestaurant;
};

export const getAllRestaurants = async ({ ctx }: { ctx: ProtectedContext }) => {
  const allRestaurants = await restaurantService.getAllRestaurants({ ctx });
  return allRestaurants;
};

export const createRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantInput;
}) => {
  const newRestaurant = await restaurantService.createRestaurant({
    ctx,
    input,
  });
  return newRestaurant;
};

export const updateRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateRestaurantInput;
}) => {
  await restaurantService.updateRestaurant({ ctx, input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const setPublishedRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetPublishedRestaurantInput;
}) => {
  await restaurantService.setPublishedRestaurant({ input });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const deleteRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteRestaurantInput;
}) => {
  await restaurantService.deleteRestaurant({ input });
  const allRestaurants = await restaurantService.getAllRestaurants({ ctx });
  return allRestaurants;
};

// Restaurant Language s
export const createRestaurantLanguage = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantLanguageInput;
}) => {
  await restaurantService.createRestaurantLanguage({
    ctx,
    input,
  });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};

export const setEnabledRestaurantLanguages = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetEnabledRestaurantLanguagesInput;
}) => {
  await restaurantService.setEnabledRestaurantLanguages({
    input,
  });
  const restaurant = await restaurantService.getRestaurantWithUserCheck({
    ctx,
    input,
  });
  return restaurant;
};
