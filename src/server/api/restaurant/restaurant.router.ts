import * as restaurantController from "~/server/api/restaurant/restaurant.controller";
import * as restaurantSchema from "~/server/api/restaurant/restaurant.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: publicProcedure
    .input(restaurantSchema.getRestaurantInput)
    .query(restaurantController.getRestaurant),
  getRestaurantWithUserCheck: protectedProcedure
    .input(restaurantSchema.getRestaurantInput)
    .query(restaurantController.getRestaurantWithUserCheck),
  getAllRestaurants: protectedProcedure.query(
    restaurantController.getAllRestaurants
  ),
  createRestaurant: protectedProcedure
    .input(restaurantSchema.createRestaurantInput)
    .mutation(restaurantController.createRestaurant),
  updateRestaurant: protectedProcedure
    .input(restaurantSchema.updateRestaurantInput)
    .mutation(restaurantController.updateRestaurant),
  createRestaurantLanguage: protectedProcedure
    .input(restaurantSchema.createRestaurantLanguageInput)
    .mutation(restaurantController.createRestaurantLanguage),
  setPublishedRestaurant: protectedProcedure
    .input(restaurantSchema.setPublishedRestaurantInput)
    .mutation(restaurantController.setPublishedRestaurant),
  setEnabledRestaurantLanguages: protectedProcedure
    .input(restaurantSchema.setEnabledRestaurantLanguagesInput)
    .mutation(restaurantController.setEnabledRestaurantLanguages),
  deleteRestaurant: protectedProcedure
    .input(restaurantSchema.deleteRestaurantInput)
    .mutation(restaurantController.deleteRestaurant),
});
