import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  createRestaurantHandler,
  createRestaurantLanguageHandler,
  deleteRestaurantHandler,
  getAllRestaurantsHandler,
  getRestaurantHandler,
  setEnabledRestaurantLanguagesHandler,
  setPublishedRestaurantHandler,
  updateRestaurantHandler,
} from "../controllers/restaurant.controller";
import {
  createRestaurantLanguageSchemaInput,
  createRestaurantSchemaInput,
  deleteRestaurantSchemaInput,
  getRestaurantSchemaInput,
  setEnabledRestaurantLanguagesSchemaInput,
  setPublishedRestaurantSchemaInput,
  updateRestaurantSchemaInput,
} from "../schemas/restaurant.schema";

export const restaurantRouter = createTRPCRouter({
  getRestaurant: publicProcedure
    .input(getRestaurantSchemaInput)
    .query(async ({ ctx, input }) => getRestaurantHandler({ ctx, input })),
  getAllRestaurants: protectedProcedure.query(async ({ ctx }) =>
    getAllRestaurantsHandler({ ctx })
  ),
  createRestaurant: protectedProcedure
    .input(createRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) =>
      createRestaurantHandler({ ctx, input })
    ),
  updateRestaurant: protectedProcedure
    .input(updateRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) =>
      updateRestaurantHandler({ ctx, input })
    ),
  createRestaurantLanguage: protectedProcedure
    .input(createRestaurantLanguageSchemaInput)
    .mutation(async ({ ctx, input }) =>
      createRestaurantLanguageHandler({ ctx, input })
    ),
  setPublishedRestaurant: protectedProcedure
    .input(setPublishedRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) =>
      setPublishedRestaurantHandler({ ctx, input })
    ),
  setEnabledRestaurantLanguages: protectedProcedure
    .input(setEnabledRestaurantLanguagesSchemaInput)
    .mutation(async ({ ctx, input }) =>
      setEnabledRestaurantLanguagesHandler({ ctx, input })
    ),
  deleteRestaurant: protectedProcedure
    .input(deleteRestaurantSchemaInput)
    .mutation(async ({ ctx, input }) =>
      deleteRestaurantHandler({ ctx, input })
    ),
});
