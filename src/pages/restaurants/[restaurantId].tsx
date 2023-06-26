import type { LanguageCode } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";

import { Icons } from "~/components/Icons";
import { LanguageToggle } from "~/components/LanguageToggle";
import Menu from "~/components/Menu";
import { ModeToggle } from "~/components/ModeToggle";
import RestaurantLayout from "~/layouts/Restaurant.layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { formatTranslationToOneLanguageWithDetails } from "~/utils/formatTranslationToOneLanguage";

// Infer types from getServerSideProps
type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Restaurant = ({ restaurant }: ServerSideProps) => {
  console.log("restaurant: ", restaurant);
  const { name, address, description } = restaurant.restaurantI18N;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RestaurantLayout>
        <div className="container flex flex-col items-stretch justify-center gap-8 md:max-w-screen-lg">
          {/* name and switcher */}
          <div className="sticky top-0 z-40 flex  justify-between gap-x-4 bg-background py-3">
            <h1 className="text-3xl font-bold">{name}</h1>

            <div className="ml-auto">
              <ModeToggle />
            </div>

            {restaurant.restaurantLanguage.length > 1 && (
              <LanguageToggle languages={restaurant.restaurantLanguage} />
            )}
          </div>
          {/* general info */}
          <div className="grid grid-cols-1 gap-4  md:grid-cols-2">
            <div className=" relative h-80">
              <Image
                src="https://menusa.dodostatic.net/images/7740007bde8911ed8368719f3939c0be_11edcc86977e0ce38c1e0a0a21479180_1200_900.jpg"
                alt="Photo by DoDo"
                fill
                className="rounded-3xl object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-5 rounded-3xl border p-5 ">
              <div className="flex gap-3">
                <Icons.clock2 className="shrink-0" />{" "}
                <span className="font-semibold">from 9:00 to 21:00</span>
              </div>
              <div className="flex gap-3">
                <Icons.mapPin className="shrink-0" />
                <span className="font-semibold">{address}</span>
              </div>
              <div className="flex gap-3">
                <Icons.store className="shrink-0" />
                <span className="font-semibold">{description}</span>
              </div>
            </div>
          </div>

          <Menu menu={restaurant.menu} />
        </div>
      </RestaurantLayout>
    </>
  );
};

export default Restaurant;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const trpc = appRouter.createCaller({ session: null, prisma });

  //TODO: HANDLE CASE WHEN IT CAN BE NON VALID VALUE
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
};
