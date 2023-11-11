import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession } from "next-auth/react";
import React from "react";

import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { isTRPCError } from "~/helpers/isTRPCError";
import { RestaurantPreviewScreen } from "~/screens/restaurant/RestaurantPreviewScreen";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RestaurantPreviewPage = ({ restaurant }: ServerSideProps) => (
  <RestaurantPreviewScreen restaurant={restaurant} />
);

export default RestaurantPreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (!session) {
    // This page should be only accessible once you are logged in
    return { redirect: { destination: "/" } };
  }

  try {
    // * https://peterwhite.dev/posts/gSSP-and-tRPC
    const trpc = appRouter.createCaller(createInnerTRPCContext({ session }));

    const restaurant = await trpc.restaurant.getRestaurant({
      restaurantId: (ctx.params?.restaurantId as string) ?? "",
    });

    if (restaurant.userId === session?.user?.id) {
      // Preview page should only be accessible by the user who manages the restaurant
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
    }

    return { redirect: { destination: "/" } };
  } catch (e) {
    if (isTRPCError(e) && e.code === "NOT_FOUND") {
      return { redirect: { destination: "/404" } };
    }

    return { redirect: { destination: "/" } };
  }
};
