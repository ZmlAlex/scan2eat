import { type LanguageCode } from "@prisma/client";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { errorMapper } from "~/helpers/errorMapper";
import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { isTRPCServerError } from "~/helpers/isTRPCError";
import { serverClient } from "~/libs/trpc/serverClient";
import { RestaurantPreviewScreen } from "~/screens/restaurant/RestaurantPreviewScreen";
import { getServerAuthSession } from "~/server/libs/auth";

const getRestaurantInfo = React.cache(
  async (restaurantId: string, locale: LanguageCode) => {
    const session = await getServerAuthSession();
    const initialRestaurantData = await serverClient.restaurant
      .getRestaurant({
        restaurantId: restaurantId || "clmaaf1wd004t3sa35fkallcm",
      })
      .catch((error) => {
        // check and redirect to the homepage if restaurant doesn't exist
        if (isTRPCServerError(error) && error.message) {
          const errorMessage = errorMapper(error.message);

          if (errorMessage === "NotFound") {
            return redirect("/");
          }
        }
        throw error;
      });
    const restaurant = formatTranslationToOneLanguageWithDetails(
      initialRestaurantData,
      locale
    );

    // Preview page should only be accessible by the user who manages the restaurant
    if (restaurant.userId !== session?.user.id) {
      return redirect("/");
    }

    return restaurant;
  }
);

export async function generateMetadata({
  params,
}: {
  params: { restaurantId: string; locale: LanguageCode };
}): Promise<Metadata> {
  const { restaurantId, locale } = params;

  const restaurant = await getRestaurantInfo(restaurantId, locale);

  return {
    title: restaurant.restaurantI18N.name,
    description: restaurant.restaurantI18N.description,
    keywords: [restaurant.restaurantI18N.name],
    openGraph: {
      type: "website",
      images: [restaurant.logoUrl],
    },
  };
}

const RestaurantPreviewPage = async ({
  params: { locale, restaurantId },
}: {
  params: { locale: LanguageCode; restaurantId: string };
}) => {
  const restaurant = await getRestaurantInfo(restaurantId, locale);

  return <RestaurantPreviewScreen restaurant={restaurant} />;
};

export default RestaurantPreviewPage;
