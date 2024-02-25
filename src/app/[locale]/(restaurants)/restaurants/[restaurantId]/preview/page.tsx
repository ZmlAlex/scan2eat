import { type LanguageCode } from "@prisma/client";
import { redirect } from "next/navigation";

import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { serverClient } from "~/libs/trpc/serverClient";
import { RestaurantPreviewScreen } from "~/screens/restaurant/RestaurantPreviewScreen";
import { getServerAuthSession } from "~/server/libs/auth";

const RestaurantPreviewPage = async ({
  params: { locale, restaurantId },
}: {
  params: { locale: LanguageCode; restaurantId: string };
}) => {
  const session = await getServerAuthSession();
  const initialRestaurantData = await serverClient.restaurant.getRestaurant({
    restaurantId: restaurantId || "clmaaf1wd004t3sa35fkallcm",
  });
  const restaurant = formatTranslationToOneLanguageWithDetails(
    initialRestaurantData,
    locale
  );

  // Preview page should only be accessible by the user who manages the restaurant
  if (restaurant.userId !== session?.user.id) {
    return redirect("/");
  }

  return <RestaurantPreviewScreen restaurant={restaurant} />;
};

export default RestaurantPreviewPage;
