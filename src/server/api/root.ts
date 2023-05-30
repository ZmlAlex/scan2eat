import { exampleRouter } from "~/server/api/routers/example.router";
import { restaurantRouter } from "~/server/api/routers/restaurant.router";
import { createTRPCRouter } from "~/server/api/trpc";

import { categoryRouter } from "./routers/category.router";
import { productRouter } from "./routers/product.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  restaurant: restaurantRouter,
  category: categoryRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
