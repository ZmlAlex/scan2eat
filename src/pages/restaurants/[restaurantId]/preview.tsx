import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import React from "react";

import { Icons } from "~/components/Icons";
import RestaurantHeader from "~/components/RestaurantHeader";
import RestaurantInformation from "~/components/RestaurantInformation";
import RestaurantMenu from "~/components/RestaurantMenu";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/Alert";
import RestaurantLayout from "~/layouts/Restaurant.layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { isTRPCError } from "~/server/helpers/isTRPCError";
import { formatTranslationToOneLanguageWithDetails } from "~/utils/formatTranslationToOneLanguage";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RestaurantPagePreview = ({ restaurant }: ServerSideProps) => {
  const { category, product, currencyCode, restaurantLanguage } = restaurant;
  const { name, description } = restaurant.restaurantI18N;

  const t = useTranslations("PreviewRestaurant");

  return (
    <>
      <NextSeo title={name} description={description} />

      <RestaurantLayout>
        {/* name and switcher */}
        <RestaurantHeader name={name} restaurantLanguage={restaurantLanguage} />
        {/* preview alert */}
        <Alert variant="destructive">
          <Icons.warning className="h-5 w-5" />
          <AlertTitle>{t("alert.title")}</AlertTitle>
          <AlertDescription>{t("alert.description")}</AlertDescription>
        </Alert>
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

export default RestaurantPagePreview;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (!session) {
    // This page should be only accessible once you are logged in
    return { redirect: { destination: "/" } };
  }

  //TODO: MOVE IT TO THE APP FOLDER
  try {
    const trpc = appRouter.createCaller({ session, prisma });

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
