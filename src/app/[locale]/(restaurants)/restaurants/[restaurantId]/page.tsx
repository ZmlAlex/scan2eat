import { type LanguageCode } from "@prisma/client";
import { redirect } from "next/navigation";

import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { serverClient } from "~/libs/trpc/serverClient";
import { RestaurantScreen } from "~/screens/restaurant/RestaurantScreen";

const RestaurantPage = async ({
  params: { locale, restaurantId },
}: {
  params: { locale: LanguageCode; restaurantId: string };
}) => {
  const initialRestaurantData = await serverClient.restaurant.getRestaurant({
    restaurantId: restaurantId || "clmaaf1wd004t3sa35fkallcm",
  });
  const restaurant = formatTranslationToOneLanguageWithDetails(
    initialRestaurantData,
    locale
  );

  if (!restaurant.isPublished) {
    return redirect("/404");
  }

  return <RestaurantScreen restaurant={restaurant} />;
};

export default RestaurantPage;
