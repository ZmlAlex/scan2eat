import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import React from "react";

import { DashboardHeader } from "~/components/DashboardHeader";
import { DashboardRestaurantHeaderContent } from "~/components/DashboardRestaurantHeaderContent";
import { SkeletonFactory } from "~/components/ui/Skeleton";
import { useGetRestaurant } from "~/hooks/useGetRestaurant";
import { DashboardLayout } from "~/layouts/Dashboard.layout";

import { LanguagesBlock } from "./components/LanguagesBlock";

export const DashboardRestaurantSettingsScreen = () => {
  const router = useRouter();
  const t = useTranslations("Dashboard.page.restaurantSettings");

  const { data: restaurant, status } = useGetRestaurant(
    router.query.restaurantId as string
  );

  return (
    <DashboardLayout>
      {status === "loading" && <SkeletonFactory />}
      {status === "success" && (
        <>
          <DashboardHeader heading={t("title")} text={t("description")}>
            <DashboardRestaurantHeaderContent
              restaurant={restaurant}
              isRestauranatLanguageSelectorAvailable={false}
            />
          </DashboardHeader>
          <div className="grid gap-10">
            <div>
              <LanguagesBlock restaurant={restaurant} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};
