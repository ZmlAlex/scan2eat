import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import React from "react";

import { Icons } from "~/components/Icons";
import { RestaurantHeader } from "~/components/RestaurantHeader";
import { RestaurantInformation } from "~/components/RestaurantInformation";
import { RestaurantMenu } from "~/components/RestaurantMenu";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/Alert";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { RestaurantLayout } from "~/layouts/Restaurant.layout";

type Props = {
  restaurant: RestaurantWithDetails;
};

export const RestaurantPreviewScreen = ({ restaurant }: Props) => {
  const { category, product, currencyCode, restaurantLanguage } = restaurant;
  const { name, description } = restaurant.restaurantI18N;

  const t = useTranslations("Page.previewRestaurant");

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
