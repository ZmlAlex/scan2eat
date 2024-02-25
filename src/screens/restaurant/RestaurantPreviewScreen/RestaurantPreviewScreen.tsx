import { useTranslations } from "next-intl";
import React from "react";

import { Icons } from "~/components/Icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/Alert";
import type { RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { RestaurantScreen } from "~/screens/restaurant/RestaurantScreen";

type Props = {
  restaurant: RestaurantWithDetails;
};

export const RestaurantPreviewScreen = ({ restaurant }: Props) => {
  const t = useTranslations("Page.previewRestaurant");

  return (
    <RestaurantScreen restaurant={restaurant}>
      <Alert variant="destructive">
        <Icons.warning className="h-5 w-5" />
        <AlertTitle>{t("alert.title")}</AlertTitle>
        <AlertDescription>{t("alert.description")}</AlertDescription>
      </Alert>
    </RestaurantScreen>
  );
};
