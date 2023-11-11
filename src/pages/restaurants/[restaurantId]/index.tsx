import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";

import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { isTRPCError } from "~/helpers/isTRPCError";
import { RestaurantScreen } from "~/screens/restaurant/RestaurantScreen";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RestaurantPage = ({ restaurant }: ServerSideProps) => (
  <RestaurantScreen restaurant={restaurant} />
);

export default RestaurantPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // * https://peterwhite.dev/posts/gSSP-and-tRPC
  const trpc = appRouter.createCaller(
    createInnerTRPCContext({ session: null })
  );

  try {
    const restaurant = await trpc.restaurant.getRestaurant({
      restaurantId: (ctx.params?.restaurantId as string) ?? "",
    });

    if (!restaurant.isPublished) {
      return { redirect: { destination: "/404" } };
    }

    return {
      props: {
        restaurant: formatTranslationToOneLanguageWithDetails(
          restaurant,
          ctx.locale as LanguageCode
        ),
        messages: (await import(
          `~/lang/${ctx.locale as string}.json`
        )) as IntlMessages,
      },
    };
  } catch (e) {
    if (isTRPCError(e) && e.code === "NOT_FOUND") {
      return { redirect: { destination: "/404" } };
    }

    return { redirect: { destination: "/" } };
  }
};
