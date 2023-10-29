import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";

type CreateRestaurantInput = inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> & {
  logoUrl: string;
};

// https://www.patterns.dev/posts/factory-pattern
export const createRestaurantInputFactory = (
  values?: Partial<CreateRestaurantInput>
): CreateRestaurantInput => ({
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
  logoUrl: "bla!",
  languageCode: "english",
  phone: "+70000000000",
  ...values,
});
