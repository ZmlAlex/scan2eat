import { categoryRouter } from "~/server/api/routers/category.router";
import { productRouter } from "~/server/api/routers/product.router";
import { restaurantRouter } from "~/server/api/routers/restaurant.router";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
//TODO: MAKE IT PLURAL
export const appRouter = createTRPCRouter({
  restaurant: restaurantRouter,
  category: categoryRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
