import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { NextSeo } from "next-seo";
import React from "react";

import RestaurantHeader from "~/components/RestaurantHeader";
import RestaurantInformation from "~/components/RestaurantInformation";
import RestaurantMenu from "~/components/RestaurantMenu";
import RestaurantLayout from "~/layouts/Restaurant.layout";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { isTRPCError } from "~/helpers/isTRPCError";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RestaurantPage = ({ restaurant }: ServerSideProps) => {
  const { category, product, currencyCode, restaurantLanguage } = restaurant;
  const { name, description } = restaurant.restaurantI18N;

  return (
    <>
      <NextSeo title={name} description={description} />
      <RestaurantLayout>
        {/* name and switcher */}
        <RestaurantHeader name={name} restaurantLanguage={restaurantLanguage} />
        {/* general info */}
        <RestaurantInformation restaurant={restaurant} />
        {/* menu */}
        <RestaurantMenu
          categories={category}
          products={product}
          currencyCode={currencyCode}
        />
      </RestaurantLayout>
    </>
  );
};

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
