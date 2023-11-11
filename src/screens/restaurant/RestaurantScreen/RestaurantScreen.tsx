import { NextSeo } from "next-seo";
import React from "react";

import { RestaurantHeader } from "~/components/RestaurantHeader";
import { RestaurantInformation } from "~/components/RestaurantInformation";
import { RestaurantMenu } from "~/components/RestaurantMenu";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { RestaurantLayout } from "~/layouts/Restaurant.layout";

type Props = {
  restaurant: RestaurantWithDetails;
};

export const RestaurantScreen = ({ restaurant }: Props) => {
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

export default RestaurantScreen;
