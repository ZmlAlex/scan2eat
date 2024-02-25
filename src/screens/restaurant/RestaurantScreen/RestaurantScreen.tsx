"use client";
import React from "react";

import { RestaurantHeader } from "~/components/RestaurantHeader";
import { RestaurantInformation } from "~/components/RestaurantInformation";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { RestaurantMenu } from "~/screens/restaurant/RestaurantScreen/components/RestaurantMenu";

type Props = {
  restaurant: RestaurantWithDetails;
  children?: React.ReactNode;
};

export const RestaurantScreen = ({ restaurant, children }: Props) => {
  const { category, product, currencyCode, restaurantLanguage } = restaurant;
  const { name } = restaurant.restaurantI18N;

  return (
    <>
      {/* name and switcher */}
      {/* TODO: USE HOOK */}
      <RestaurantHeader name={name} restaurantLanguage={restaurantLanguage} />
      {/* additional banners and alerts */}
      {children}
      {/* general info */}
      {/* TODO: USE HOOK */}
      <RestaurantInformation restaurant={restaurant} />
      {/* menu */}
      <RestaurantMenu
        categories={category}
        products={product}
        currencyCode={currencyCode}
      />
    </>
  );
};

export default RestaurantScreen;
