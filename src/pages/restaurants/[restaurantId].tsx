import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { NextSeo } from "next-seo";
import React from "react";

import { Icons } from "~/components/Icons";
import { LanguageToggle } from "~/components/LanguageToggle";
import Menu from "~/components/Menu";
import { ModeToggle } from "~/components/ModeToggle";
import RestaurantLayout from "~/layouts/Restaurant.layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { isTRPCError } from "~/server/helpers/isTRPCError";
import { formatTranslationToOneLanguageWithDetails } from "~/utils/formatTranslationToOneLanguage";

const MOCK_URL =
  "https://menusa-cdn.dodostatic.net/images/7740007bde8911ed8368719f3939c0be_11edcc86977e0ce38c1e0a0a21479180_1200_900.jpg";
// Infer types from getServerSideProps
type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Restaurant = ({ restaurant }: ServerSideProps) => {
  const { category, product, currencyCode, restaurantLanguage, workingHours } =
    restaurant;
  const { name, address, description } = restaurant.restaurantI18N;

  return (
    <>
      <NextSeo title={name} description={description} />

      <RestaurantLayout>
        <div className="container flex flex-col items-stretch justify-center gap-8 md:max-w-screen-lg">
          {/* name and switcher */}
          <div className="sticky top-0 z-40 flex  justify-between gap-x-4 bg-background py-3">
            <h1 className="font-heading text-3xl font-bold">{name}</h1>

            <div className="ml-auto">
              <ModeToggle />
            </div>

            {restaurantLanguage.length > 1 && (
              <LanguageToggle languages={restaurant.restaurantLanguage} />
            )}
          </div>
          {/* general info */}
          <div className="grid grid-cols-1 gap-4  md:grid-cols-2">
            <div className=" relative h-80">
              <Image
                className="rounded-3xl object-cover"
                src={restaurant.logoUrl || MOCK_URL}
                alt="Restaurant"
                fill
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center gap-5 rounded-3xl border p-5 ">
              {!!workingHours && (
                <div className="flex gap-3">
                  <Icons.clock2 className="shrink-0" />
                  {/* TODO: HANDLE TIME */}
                  <span className="font-semibold">{workingHours}</span>
                </div>
              )}
              {!!address && (
                <div className="flex gap-3">
                  <Icons.mapPin className="shrink-0" />
                  <span className="font-semibold">{address}</span>
                </div>
              )}
              {!!description && (
                <div className="flex gap-3">
                  <Icons.store className="shrink-0" />
                  <span className="font-semibold">{description}</span>
                </div>
              )}
            </div>
          </div>

          <Menu
            categories={category}
            products={product}
            currencyCode={currencyCode}
          />
        </div>
      </RestaurantLayout>
    </>
  );
};

export default Restaurant;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const trpc = appRouter.createCaller({ session: null, prisma });

  //TODO: MOVE IT TO THE APP FOLDER
  try {
    const restaurant = await trpc.restaurant.getRestaurant({
      restaurantId: (ctx.params?.restaurantId as string) ?? "",
    });

    return {
      props: {
        restaurant: formatTranslationToOneLanguageWithDetails(
          restaurant,
          ctx.locale as LanguageCode
        ),
      },
    };
  } catch (e) {
    if (isTRPCError(e) && e.code === "NOT_FOUND") {
      return { redirect: { destination: "/404" } };
    }

    return { redirect: { destination: "/" } };
  }
};
